// 导入必要的组件和工具函数
import Pricing from '@/components/ui/Pricing/Pricing';  // 导入定价组件
import { createClient } from '@/utils/supabase/server';  // 导入创建 Supabase 客户端的函数

import {
  getProducts,   // 获取产品列表的函数
  getSubscription,  // 获取订阅信息的函数
  getUser  // 获取用户信息的函数
} from '@/utils/supabase/queries';

// 定义定价页面组件（使用 Next.js 的异步服务器组件）
export default async function PricingPage() {
  // 创建 Supabase 客户端实例
  const supabase = createClient();
  
  // 使用 Promise.all 并行请求多个数据，提高性能
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),        // 获取当前用户信息
    getProducts(supabase),    // 获取所有产品信息
    getSubscription(supabase) // 获取用户的订阅状态
  ]);

  // 渲染定价组件，传入所需的属性
  return (
    <div className="flex flex-col gap-4">
      <Pricing
        user={user}
        products={products ?? []}  // 如果 products 为空，则使用空数组作为默认���
        subscription={subscription}
      />
    </div>
  );
} 