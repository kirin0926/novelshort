'use client';

import { createClient } from '@/utils/supabase/client';
import { getURL } from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import { Button } from "@nextui-org/button";

// OAuth 登录组件
export default function OAuthSignIn() {
  const router = useRouter();
  const supabase = createClient();

  // 处理 Google 登录
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${getURL()}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('Google 登录错误:', error.message);
      }
    } catch (err) {
      console.error('Google 登录失败:', err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="bordered"
        startContent={
          <svg 
            className="h-5 w-5" 
            aria-hidden="true" 
            focusable="false" 
            data-prefix="fab" 
            data-icon="google" 
            role="img" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 488 512"
          >
            <path 
              fill="currentColor" 
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            />
          </svg>
        }
        onClick={handleGoogleSignIn}
        className="w-full"
        size="lg"
      >
        使用 Google 账号登录
      </Button>
    </div>
  );
}
