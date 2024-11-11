import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types_db';

// 定义一个函数来创建用于服务器端操作的 Supabase 客户端
// 该函数接收一个由 next/headers cookies 创建的 cookie 存储作为参数
export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient<Database>(
    // 将环境变量中的 Supabase URL 和匿名密钥传递给客户端
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    // 定义一个 cookies 对象，包含与 cookie 存储交互的方法，并将其传递给客户端
    {
      cookies: {
        // get 方法用于通过名称获取 cookie
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // set 方法用于设置具有给定名称、值和选项的 cookie
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // 如果从服务器组件调用 set 方法，可能会发生错误
            // 如果有中间件在刷新用户会话，这个错误可以忽略
          }
        },
        // remove 方法用于通过名称删除 cookie
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // 如果从服务器组件调用 remove 方法，可能会发生错误
            // 如果有中间件在刷新用户会话，这个错误可以忽略
          }
        }
      }
    }
  );
};

// 检查 Supabase 连接状态的函数
export const checkSupabaseConnection = async () => {
  try {
    const supabase = createClient();
    
    // 尝试执行一个简单的查询来验证连接
    const { data, error } = await supabase.from('users').select('count').single();
    console.log(data);
    if (error) {
      console.error('Supabase 连接错误:', error.message);
      return {
        isConnected: false,
        error: error.message
      };
    }

    return {
      isConnected: true,
      error: null
    };
  } catch (error) {
    console.error('Supabase 连接检查失败:', error);
    return {
      isConnected: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
};

// 使用示例:
/*
const checkConnection = async () => {
  const connectionStatus = await checkSupabaseConnection();
  if (connectionStatus.isConnected) {
    console.log('Supabase 连接成功');
  } else {
    console.error('Supabase 连接失败:', connectionStatus.error);
  }
};
*/
