import Stripe from 'stripe';

// 创建 Stripe 实例，用于服务器端操作
export const stripe = new Stripe(
  // 优先使用生产环境的密钥，如果没有则使用测试环境的密钥
  process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? '',
  {
    // Stripe API 版本配置
    // https://github.com/stripe/stripe-node#configuration
    // https://stripe.com/docs/api/versioning
    // @ts-ignore
    apiVersion: null,

    // 注册为官方 Stripe 插件
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
      name: 'Next.js Subscription Starter',
      version: '0.0.0',
      url: 'https://github.com/vercel/nextjs-subscription-payments'
    }
  }
);

// 检查 Stripe 连接状态的函数
export const checkStripeConnection = async () => {
  try {
    // 尝试获取账户余额来验证连接
    const balance = await stripe.balance.retrieve();
    
    // 检查 webhook 密钥是否配置
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    // 检查公钥是否配置
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ?? 
                          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!webhookSecret) {
      return {
        isConnected: false,
        error: 'Webhook 密钥未配置',
        details: {
          balance: true,
          webhook: false,
          publishableKey: !!publishableKey
        }
      };
    }

    if (!publishableKey) {
      return {
        isConnected: false,
        error: '公钥未配置',
        details: {
          balance: true,
          webhook: true,
          publishableKey: false
        }
      };
    }

    // 所有检查都通过
    return {
      isConnected: true,
      error: null,
      details: {
        balance: true,
        webhook: true,
        publishableKey: true,
        available: balance.available.map(b => ({
          amount: b.amount,
          currency: b.currency
        }))
      }
    };
  } catch (error) {
    console.error('Stripe 连接检查失败:', error);
    return {
      isConnected: false,
      error: error instanceof Error ? error.message : '未知错误',
      details: {
        balance: false,
        webhook: false,
        publishableKey: false
      }
    };
  }
};

// 使用示例:
/*
const checkConnection = async () => {
  const connectionStatus = await checkStripeConnection();
  if (connectionStatus.isConnected) {
    console.log('Stripe 连接成功');
    console.log('可用余额:', connectionStatus.details.available);
  } else {
    console.error('Stripe 连接失败:', connectionStatus.error);
    console.log('详细状态:', connectionStatus.details);
  }
};
*/
