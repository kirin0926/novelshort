import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types_db';

// 创建一个 supabase 实例
const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const signInWithGoogle = async () => {
  console.log('supabase',supabase,'11');
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const createClient = () => supabase;
