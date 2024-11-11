import { createClient } from '@supabase/supabase-js';

// 检查 Supabase 认证配置的函数
export const checkSupabaseAuth = async () => {
  try {
    const supabase = createClient(
      
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 检查基本连接
    const { data: authSettings, error: settingsError } = await supabase
      .from('auth_settings')
      .select('*')
      .single();

    if (settingsError) {
      return {
        isConfigured: false,
        error: '无法获取认证设置',
        details: {
          connection: true,
          emailAuth: false,
          redirectUrls: false
        }
      };
    }

    // 检查重定向 URL 配置
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) {
      return {
        isConfigured: false,
        error: '站点 URL 未配置',
        details: {
          connection: true,
          emailAuth: true,
          redirectUrls: false
        }
      };
    }

    // 检查是否可以获取用户（验证 anon key 是否正确配置）
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    return {
      isConfigured: true,
      error: null,
      details: {
        connection: true,
        emailAuth: true,
        redirectUrls: true,
        anonKey: !userError,
        currentUser: user ? user.email : null
      }
    };

  } catch (error) {
    console.error('Supabase 认证检查失败:', error);
    return {
      isConfigured: false,
      error: error instanceof Error ? error.message : '未知错误',
      details: {
        connection: false,
        emailAuth: false,
        redirectUrls: false
      }
    };
  }
};

// 使用示例:
/*
const checkAuth = async () => {
  const authStatus = await checkSupabaseAuth();
  if (authStatus.isConfigured) {
    console.log('Supabase 认证配置正确');
    console.log('当前用户:', authStatus.details.currentUser);
  } else {
    console.error('Supabase 认证配置错误:', authStatus.error);
    console.log('详细状态:', authStatus.details);
  }
};
*/ 