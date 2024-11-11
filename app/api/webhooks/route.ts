import Stripe from 'stripe';
import { stripe } from '@/utils/stripe/config';
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
  deleteProductRecord,
  deletePriceRecord
} from '@/utils/supabase/admin';

// 定义需要处理的 Stripe 事件类型集合
const relevantEvents = new Set([
  'product.created',    // 产品创建
  'product.updated',    // 产品更新
  'product.deleted',    // 产品删除
  'price.created',      // 价格创建
  'price.updated',      // 价格更新
  'price.deleted',      // 价格删除
  'checkout.session.completed',  // 结账会话完成
  'customer.subscription.created',  // 客户订阅创建
  'customer.subscription.updated',  // 客户订阅更新
  'customer.subscription.deleted'   // 客户订阅删除
]);

// POST 请求处理函数
export async function POST(req: Request) {
  // 获取请求体的原始数据
  const body = await req.text();
  // 获取 Stripe 签名（用于验证 webhook 请求的真实性）
  const sig = req.headers.get('stripe-signature') as string;
  // 获取 webhook 密钥
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    // 验证 webhook 密钥是否存在
    if (!sig || !webhookSecret)
      return new Response('Webhook secret not found.', { status: 400 });
    
    // 使用 Stripe 验证 webhook 事件
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`🔔  收到 Webhook: ${event.type}`);
  } catch (err: any) {
    // 如果验证失败，返回错误信息
    console.log(`❌ 错误信息: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 检查事件类型是否在我们需要处理的集合中
  if (relevantEvents.has(event.type)) {
    try {
      // 根据不同的事件类型执行相应的操作
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          // 创建或更新产品记录
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case 'price.created':
        case 'price.updated':
          // 创建或更新价格记录
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case 'price.deleted':
          // 删除价格记录
          await deletePriceRecord(event.data.object as Stripe.Price);
          break;
        case 'product.deleted':
          // 删除产品记录
          await deleteProductRecord(event.data.object as Stripe.Product);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          // 处理订阅状态变更
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === 'customer.subscription.created'
          );
          break;
        case 'checkout.session.completed':
          // 处理结账会话完成事件
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === 'subscription') {
            // 如果是订阅模式，更新订阅状态
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
          }
          break;
        default:
          // 如果是未处理的事件类型，抛出错误
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      // 如果处理过程中出现错误，记录错误并返回 400 状态码
      console.log(error);
      return new Response(
        'Webhook handler failed. View your Next.js function logs.',
        {
          status: 400
        }
      );
    }
  } else {
    // 如果收到不支持的事件类型，返回 400 状态码
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400
    });
  }
  // 处理成功，返回确认信息
  return new Response(JSON.stringify({ received: true }));
}
