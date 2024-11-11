import { toDateTime } from '@/utils/helpers';
import { stripe } from '@/utils/stripe/config';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import type { Database, Tables, TablesInsert } from 'types_db';

type Product = Tables<'products'>;
type Price = Tables<'prices'>;

// 控制试用期长度
const TRIAL_PERIOD_DAYS = 0;

// 注意: supabaseAdmin 使用 SERVICE_ROLE_KEY，必须只在安全的服务器端环境中使用
// 因为它具有管理员权限并会覆盖 RLS 策略！
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// 创建或更新产品记录
const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata
  };

  const { error: upsertError } = await supabaseAdmin
    .from('products')
    .upsert([productData]);
  if (upsertError)
    throw new Error(`产品插入/更新失败: ${upsertError.message}`);
  console.log(`产品已插入/更新: ${product.id}`);
};

// 创建或更新价格记录，包含重试机制
const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3
) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    currency: price.currency,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS
  };

  const { error: upsertError } = await supabaseAdmin
    .from('prices')
    .upsert([priceData]);

  // 处理外键约束错误，进行重试
  if (upsertError?.message.includes('foreign key constraint')) {
    if (retryCount < maxRetries) {
      console.log(`重试第 ${retryCount + 1} 次，价格 ID: ${price.id}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await upsertPriceRecord(price, retryCount + 1, maxRetries);
    } else {
      throw new Error(
        `价格插入/更新在 ${maxRetries} 次重试后失败: ${upsertError.message}`
      );
    }
  } else if (upsertError) {
    throw new Error(`价格插入/更新失败: ${upsertError.message}`);
  } else {
    console.log(`价格已插入/更新: ${price.id}`);
  }
};

// 删除产品记录
const deleteProductRecord = async (product: Stripe.Product) => {
  const { error: deletionError } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', product.id);
  if (deletionError)
    throw new Error(`产品删除失败: ${deletionError.message}`);
  console.log(`产品已删除: ${product.id}`);
};

// 删除价格记录
const deletePriceRecord = async (price: Stripe.Price) => {
  const { error: deletionError } = await supabaseAdmin
    .from('prices')
    .delete()
    .eq('id', price.id);
  if (deletionError) throw new Error(`价格删除失败: ${deletionError.message}`);
  console.log(`价格已删除: ${price.id}`);
};

// 在 Supabase 中创建或更新客户记录
const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
  const { error: upsertError } = await supabaseAdmin
    .from('customers')
    .upsert([{ id: uuid, stripe_customer_id: customerId }]);

  if (upsertError)
    throw new Error(`Supabase 客户记录创建失败: ${upsertError.message}`);

  return customerId;
};

// 在 Stripe 中创建新客户
const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error('Stripe 客户创建失败。');

  return newCustomer.id;
};

// 创建或检索客户信息
const createOrRetrieveCustomer = async ({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) => {
  // 检查客户是否已存在于 Supabase
  const { data: existingSupabaseCustomer, error: queryError } =
    await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', uuid)
      .maybeSingle();

  if (queryError) {
    throw new Error(`Supabase 客户查询失败: ${queryError.message}`);
  }

  // 使用 Supabase 客户 ID 检索 Stripe 客户 ID，如果失败则使用邮箱
  let stripeCustomerId: string | undefined;
  if (existingSupabaseCustomer?.stripe_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingSupabaseCustomer.stripe_customer_id
    );
    stripeCustomerId = existingStripeCustomer.id;
  } else {
    // 如果 Supabase 中没有 Stripe ID，尝试通过邮箱检索 Stripe 客户 ID
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
  }

  // 如果仍然没有 stripeCustomerId，在 Stripe 中创建新客户
  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email);
  if (!stripeIdToInsert) throw new Error('Stripe 客户创建失败。');

  if (existingSupabaseCustomer && stripeCustomerId) {
    // 如果 Supabase 有记录但与 Stripe 不匹配，更新 Supabase 记录
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      const { error: updateError } = await supabaseAdmin
        .from('customers')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', uuid);

      if (updateError)
        throw new Error(
          `Supabase 客户记录更新失败: ${updateError.message}`
        );
      console.warn(
        `Supabase 客户记录与 Stripe ID 不匹配。Supabase 记录已更新。`
      );
    }
    return stripeCustomerId;
  } else {
    console.warn(
      `Supabase 客户记录缺失。已创建新记录。`
    );

    // 如果 Supabase 没有记录，创建新记录并返回 Stripe 客户 ID
    const upsertedStripeCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeIdToInsert
    );
    if (!upsertedStripeCustomer)
      throw new Error('Supabase 客户记录创建失败。');

    return upsertedStripeCustomer;
  }
};

// 将支付方式的账单详情复制到客户对象。
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] }
    })
    .eq('id', uuid);
  if (updateError) throw new Error(`客户更新失败: ${updateError.message}`);
};

// 管理订阅状态变更
const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // 从映射表获取客户的 UUID
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (noCustomerError)
    throw new Error(`客户查询失败: ${noCustomerError.message}`);

  const { id: uuid } = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method']
  });
  // 更新订阅对象的最新状态
  const subscriptionData: TablesInsert<'subscriptions'> = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    //TODO 检查订阅数量
    // @ts-ignore
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    current_period_start: toDateTime(
      subscription.current_period_start
    ).toISOString(),
    current_period_end: toDateTime(
      subscription.current_period_end
    ).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null
  };

  const { error: upsertError } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData]);
  if (upsertError)
    throw new Error(`订阅插入/更新失败: ${upsertError.message}`);
  console.log(
    `已为用户 [${uuid}] 插入/更新订阅 [${subscription.id}]`
  );

  // 对于新订阅，将账单详情复制到客户对象
  // 注意：这是一个耗费资源的操作，应该在最后执行
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange
};
