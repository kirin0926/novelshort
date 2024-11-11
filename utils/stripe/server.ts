'use server';

import Stripe from 'stripe';
import { stripe } from '@/utils/stripe/config';
import { createClient } from '@/utils/supabase/server';
import { createOrRetrieveCustomer } from '@/utils/supabase/admin';
import {
  getURL,
  getErrorRedirect,
  calculateTrialEndUnixTimestamp
} from '@/utils/helpers';
import { Tables } from '@/types_db';

// 定义价格类型
type Price = Tables<'prices'>;

// 结账响应类型
type CheckoutResponse = {
  errorRedirect?: string;
  sessionId?: string;
};

// 使用 Stripe 进行结账的函数
export async function checkoutWithStripe(
  price: Price,
  redirectPath: string = '/account'
): Promise<CheckoutResponse> {
  try {
    // 从 Supabase auth 获取用户信息
    const supabase = createClient();
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      throw new Error('Could not get user session.');
    }

    // 在 Stripe 中检索或创建客户
    let customer: string;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || ''
      });
    } catch (err) {
      console.error(err);
      throw new Error('Unable to access customer record.');
    }

    // 设置 Stripe 结账会话参数
    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true, // 允许使用促销码
      billing_address_collection: 'required', // 要求填写账单地址
      customer, // 客户 ID
      customer_update: {
        address: 'auto' // 自动更新地址
      },
      line_items: [
        {
          price: price.id, // 价格 ID
          quantity: 1 // 数量
        }
      ],
      cancel_url: getURL(), // 取消支付后的跳转 URL
      success_url: getURL(redirectPath) // 支付成功后的跳转 URL
    };

    // 根据价格类型设置不同的支付模式
    if (price.type === 'recurring') {
      // 订阅模式
      params = {
        ...params,
        mode: 'subscription',
        subscription_data: {
          // 计算试用期结束时间
          trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days)
        }
      };
    } else if (price.type === 'one_time') {
      // 一次性支付模式
      params = {
        ...params,
        mode: 'payment'
      };
    }

    // 创建 Stripe 结账会话
    let session;
    try {
      session = await stripe.checkout.sessions.create(params);
    } catch (err) {
      console.error(err);
      throw new Error('Unable to create checkout session.');
    }

    // 返回会话 ID 或错误信息
    if (session) {
      return { sessionId: session.id };
    } else {
      throw new Error('Unable to create checkout session.');
    }
  } catch (error) {
    // 错误处理
    if (error instanceof Error) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          error.message,
          'Please try again later or contact a system administrator.'
        )
      };
    } else {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      };
    }
  }
}

// 创建 Stripe 客户门户会话
export async function createStripePortal(currentPath: string) {
  try {
    // 获取当前用户信息
    const supabase = createClient();
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      if (error) {
        console.error(error);
      }
      throw new Error('Could not get user session.');
    }

    // 获取或创建 Stripe 客户
    let customer;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user.id || '',
        email: user.email || ''
      });
    } catch (err) {
      console.error(err);
      throw new Error('Unable to access customer record.');
    }

    if (!customer) {
      throw new Error('Could not get customer.');
    }

    // 创建账单门户会话
    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL('/account') // 设置返回 URL
      });
      if (!url) {
        throw new Error('Could not create billing portal');
      }
      return url;
    } catch (err) {
      console.error(err);
      throw new Error('Could not create billing portal');
    }
  } catch (error) {
    // 错误处理
    if (error instanceof Error) {
      console.error(error);
      return getErrorRedirect(
        currentPath,
        error.message,
        'Please try again later or contact a system administrator.'
      );
    } else {
      return getErrorRedirect(
        currentPath,
        'An unknown error occurred.',
        'Please try again later or contact a system administrator.'
      );
    }
  }
}
