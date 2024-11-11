import { stripe } from './config';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types_db';

// 检查产品和价格配置的函数
export const checkStripeProducts = async () => {
  try {
    // 创建 Supabase 客户端
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. 检查 Stripe 产品
    const stripeProducts = await stripe.products.list({ active: true });
    
    // 2. 检查 Stripe 价格
    const stripePrices = await stripe.prices.list({ active: true });
    
    // 3. 检查 Supabase 中的产品
    const { data: supabaseProducts, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('active', true);

    // 4. 检查 Supabase 中的价格
    const { data: supabasePrices, error: pricesError } = await supabase
      .from('prices')
      .select('*')
      .eq('active', true);

    if (productsError || pricesError) {
      return {
        isConfigured: false,
        error: '无法从 Supabase 获取产品或价格数据',
        details: {
          stripeProducts: stripeProducts.data.length,
          stripePrices: stripePrices.data.length,
          supabaseProducts: null,
          supabasePrices: null,
          error: productsError || pricesError
        }
      };
    }

    // 检查是否存在产品和价格
    if (stripeProducts.data.length === 0 || stripePrices.data.length === 0) {
      return {
        isConfigured: false,
        error: 'Stripe 中没有配置活跃的产品或价格',
        details: {
          stripeProducts: stripeProducts.data.length,
          stripePrices: stripePrices.data.length,
          supabaseProducts: supabaseProducts?.length || 0,
          supabasePrices: supabasePrices?.length || 0
        }
      };
    }

    // 检查数据是否同步
    const isInSync = 
      stripeProducts.data.length === supabaseProducts?.length &&
      stripePrices.data.length === supabasePrices?.length;

    if (!isInSync) {
      return {
        isConfigured: false,
        error: 'Stripe 和 Supabase 的数据不同步',
        details: {
          stripeProducts: stripeProducts.data.length,
          stripePrices: stripePrices.data.length,
          supabaseProducts: supabaseProducts?.length || 0,
          supabasePrices: supabasePrices?.length || 0,
          stripeProductIds: stripeProducts.data.map(p => p.id),
          supabaseProductIds: supabaseProducts?.map(p => p.id)
        }
      };
    }

    // 所有检查通过
    return {
      isConfigured: true,
      error: null,
      details: {
        stripeProducts: stripeProducts.data.length,
        stripePrices: stripePrices.data.length,
        supabaseProducts: supabaseProducts?.length || 0,
        supabasePrices: supabasePrices?.length || 0,
        products: stripeProducts.data.map(p => ({
          id: p.id,
          name: p.name,
          active: p.active
        })),
        prices: stripePrices.data.map(p => ({
          id: p.id,
          product: p.product,
          unit_amount: p.unit_amount,
          currency: p.currency,
          type: p.type
        }))
      }
    };
  } catch (error) {
    console.error('产品检查失败:', error);
    return {
      isConfigured: false,
      error: error instanceof Error ? error.message : '未知错误',
      details: {
        stripeProducts: 0,
        stripePrices: 0,
        supabaseProducts: 0,
        supabasePrices: 0
      }
    };
  }
};

// 新增同步函数
export const syncStripeToSupabase = async () => {
  try {
    // 创建 Supabase 客户端
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log('开始同步 Stripe 数据到 Supabase...');

    // 1. 获取 Stripe 数据
    const stripeProducts = await stripe.products.list({ active: true });
    const stripePrices = await stripe.prices.list({ active: true });

    console.log(`找到 ${stripeProducts.data.length} 个 Stripe 产品`);
    console.log(`找到 ${stripePrices.data.length} 个 Stripe 价格`);

    // 2. 同步产品数据
    for (const product of stripeProducts.data) {
      const { error: productError } = await supabase
        .from('products')
        .upsert({
          id: product.id,
          active: product.active,
          name: product.name,
          description: product.description ?? null,
          image: product.images?.[0] ?? null,
          metadata: product.metadata
        });

      if (productError) {
        console.error(`产品 ${product.id} 同步失败:`, productError);
      } else {
        console.log(`产品 ${product.id} 同步成功`);
      }
    }

    // 3. 同步价格数据
    for (const price of stripePrices.data) {
      const { error: priceError } = await supabase
        .from('prices')
        .upsert({
          id: price.id,
          product_id: typeof price.product === 'string' ? price.product : '',
          active: price.active,
          currency: price.currency,
          type: price.type,
          unit_amount: price.unit_amount ?? null,
          interval: price.recurring?.interval ?? null,
          interval_count: price.recurring?.interval_count ?? null,
          trial_period_days: price.recurring?.trial_period_days ?? null
        });

      if (priceError) {
        console.error(`价格 ${price.id} 同步失败:`, priceError);
      } else {
        console.log(`价格 ${price.id} 同步成功`);
      }
    }

    // 4. 验证同步结果
    const syncStatus = await checkStripeProducts();
    
    return {
      success: syncStatus.isConfigured,
      message: syncStatus.isConfigured 
        ? '同步成功' 
        : `同步后验证失败: ${syncStatus.error}`,
      details: {
        stripeProducts: stripeProducts.data.length,
        stripePrices: stripePrices.data.length,
        syncStatus: syncStatus.details
      }
    };

  } catch (error) {
    console.error('同步过程中发生错误:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '同步过程中发生未知错误',
      details: null
    };
  }
};

// 使用示例:
/*
const checkProducts = async () => {
  const status = await checkStripeProducts();
  if (status.isConfigured) {
    console.log('产品配置正确');
    console.log('产品数量:', status.details.stripeProducts);
    console.log('价格数量:', status.details.stripePrices);
  } else {
    console.error('产品配置错误:', status.error);
    console.log('详细信息:', status.details);
  }
};

const syncProducts = async () => {
  const result = await syncStripeToSupabase();
  if (result.success) {
    console.log('同步成功:', result.message);
    console.log('同步详情:', result.details);
  } else {
    console.error('同步失败:', result.message);
  }
};
*/ 