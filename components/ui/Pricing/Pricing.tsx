'use client';

import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import type { Tables } from '@/types_db';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { getErrorRedirect } from '@/utils/helpers';
import { User } from '@supabase/supabase-js';
import cn from 'classnames';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

// 数据库表类型定义
type Subscription = Tables<'subscriptions'>;  // 订阅表
type Product = Tables<'products'>;            // 产品表
type Price = Tables<'prices'>;                // 价格表

// 带价格的产品接口
interface ProductWithPrices extends Product {
  prices: Price[];  // 产品包含的所有价格选项
}

// 带产品的价格接口
interface PriceWithProduct extends Price {
  products: Product | null;  // 价格关联的产品
}

// 带产品的订阅接口
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;  // 订阅关联的价格和产品
}

// 组件属性接口
interface Props {
  user: User | null | undefined;        // 当前用户
  products: ProductWithPrices[];        // 所有产品列表
  subscription: SubscriptionWithProduct | null;  // 用户当前订阅
}

// 计费周期类型
type BillingInterval = 'lifetime' | 'year' | 'month';

export default function Pricing({ user, products, subscription }: Props) {
  // 获取所有可用的计费周期
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );
  
  const router = useRouter();
  // 当前选择的计费周期
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('month');
  // 正在处理支付的价格ID
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  // 处理 Stripe 支付
  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    // 未登录用户跳转到登录页
    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/signup');
    }

    // 创建 Stripe 支付会话
    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );

    // 处理错误重定向
    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    // 处理会话创建失败
    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          '发生未知错误',
          '请稍后重试或联系客服'
        )
      );
    }

    // 重定向到 Stripe 支付页面
    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

  // 如果没有产品，显示提示信息
  if (!products.length) {
    return (
      <section className="bg-white">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-black sm:text-center sm:text-6xl">
            未找到订阅计划，请在{' '}
            <a
              className="text-primary underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe 控制台
            </a>
            {' '}创建。
          </p>
        </div>
      </section>
    );
  }

  // 渲染订阅计划页面
  return (
    <section className="bg-white">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        {/* 页面标题和说明 */}
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-black sm:text-center sm:text-6xl">
            订阅计划
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-gray-600 sm:text-center sm:text-2xl">
            从免费开始，然后选择合适的订阅计划。高级计划可以解锁更多功能。
          </p>

          {/* 计费周期选择器 */}
          <div className="relative self-center mt-6 sm:mt-8">
            <div className="flex w-full gap-2 p-1 bg-default-100 rounded-lg">
              {intervals.includes('month') && (
                <Button
                  onClick={() => setBillingInterval('month')}
                  color="default"
                  variant={billingInterval === 'month' ? 'solid' : 'light'}
                  className="w-32 sm:w-40"
                  size="sm"
                >
                  月付
                </Button>
              )}
              {intervals.includes('year') && (
                <Button
                  onClick={() => setBillingInterval('year')}
                  color="default"
                  variant={billingInterval === 'year' ? 'solid' : 'light'}
                  className="w-32 sm:w-40"
                  size="sm"
                >
                  年付
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 价格卡片网格 */}
        <div className="mt-12 space-y-0 sm:mt-16 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {products.map((product) => {
            // 获取当前计费周期的价格
            const price = product?.prices?.find(
              (price) => price.interval === billingInterval
            );
            if (!price) return null;

            // 格式化价格显示
            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: price.currency!,
              minimumFractionDigits: 0
            }).format((price?.unit_amount || 0) / 100);

            // 渲染价格卡片
            return (
              <div
                key={product.id}
                className={cn(
                  'flex flex-col rounded-lg shadow-sm divide-y divide-gray-200 bg-white',
                  {
                    'border border-primary': subscription
                      ? product.name === subscription?.prices?.products?.name
                      : product.name === 'Freelancer'
                  },
                  'flex-1',
                  'basis-1/3',
                  'max-w-xs'
                )}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold leading-6 text-black">
                    {product.name}
                  </h2>
                  <p className="mt-4 text-gray-600">{product.description}</p>
                  <p className="mt-8">
                    <span className="text-5xl font-extrabold text-black">
                      {priceString}
                    </span>
                    <span className="text-base font-medium text-gray-600">
                      /{billingInterval}
                    </span>
                  </p>
                  <Button
                    color="default"
                    variant="solid"
                    isLoading={priceIdLoading === price.id}
                    onPress={() => handleStripeCheckout(price)}
                    className="w-full mt-8"
                    size="lg"
                    spinner={
                      <Spinner 
                        size="sm"
                        color="current"
                        className="mr-2"
                      />
                    }
                  >
                    {subscription ? '管理订阅' : '立即订阅'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
