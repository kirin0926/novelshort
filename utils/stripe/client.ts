import { loadStripe, Stripe } from '@stripe/stripe-js';

// 存储 Stripe 实例的 Promise
let stripePromise: Promise<Stripe | null>;

// 获取 Stripe 实例的函数
export const getStripe = () => {
  // 如果还没有创建过 Stripe 实例，则创建一个新的
  if (!stripePromise) {
    // loadStripe 初始化 Stripe，使用公钥
    // 优先使用生产环境的密钥，如果没有则使用测试环境的密钥
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ??
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
        ''
    );
  }

  // 返回 Stripe 实例
  return stripePromise;
};
