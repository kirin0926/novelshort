import Logo from '@/components/icons/Logo';
import OAuthSignIn from '@/components/ui/AuthForms/OauthSignIn';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function SignInWithId({
  params: { id }
}: {
  params: { id: string };
}) {
  // 检查用户是否已登录，如果已登录则重定向到首页
  const supabase = createClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session) {
    return redirect('/');
  }

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <div className="flex justify-center pb-12 ">
          <Logo width="64px" height="64px" />
        </div>
        <div className="flex flex-col space-y-4">
          <OAuthSignIn />
        </div>
      </div>
    </div>
  );
}
