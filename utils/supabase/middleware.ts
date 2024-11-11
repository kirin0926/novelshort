import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

// 创建中间件客户端
export const createClient = (request: NextRequest) => {
  // 创建一个未修改的响应
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  // 创建 Supabase 服务器客户端
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 获取 cookie
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        // 设置 cookie
        set(name: string, value: string, options: CookieOptions) {
          // 如果 cookie 被更新，同时更新请求和响应的 cookies
          request.cookies.set({
            name,
            value,
            ...options
          });
          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          });
          response.cookies.set({
            name,
            value,
            ...options
          });
        },
        // 删除 cookie
        remove(name: string, options: CookieOptions) {
          // 如果 cookie 被删除，同时更新请求和响应的 cookies
          request.cookies.set({
            name,
            value: '',
            ...options
          });
          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          });
          response.cookies.set({
            name,
            value: '',
            ...options
          });
        }
      }
    }
  );

  return { supabase, response };
};

// 更新会话
export const updateSession = async (request: NextRequest) => {
  try {
    // 此 try/catch 块仅用于交互式教程
    // 一旦连接了 Supabase，可以随时删除
    const { supabase, response } = createClient(request);

    // 如果会话过期，这将刷新会话 - 服务器组件需要
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    await supabase.auth.getUser();

    return response;
  } catch (e) {
    // 如果到达这里，说明无法创建 Supabase 客户端！
    // 这可能是因为未设置环境变量
    // 查看 http://localhost:3000 了解后续步骤
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    });
  }
};
