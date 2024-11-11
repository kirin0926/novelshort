import { Link } from "@nextui-org/link";
import Logo from '@/components/icons/Logo';
import GitHub from '@/components/icons/GitHub';
import { Divider } from "@nextui-org/divider";

export default function Footer() {
  return (
    <footer className="w-full">
      <Divider className="my-4" />
      <div className="mx-auto max-w-[1920px] px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {/* Logo 部分 */}
          <div className="col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <Logo />
              <p className="font-bold text-inherit">ShortNovel</p>
            </Link>
            <p className="mt-4 text-small text-default-500">
              发现精彩短篇小说，开启阅读新世界。
            </p>
          </div>

          {/* 产品部分 */}
          <div className="flex flex-col gap-2">
            <p className="font-medium text-default-700">产品</p>
            <Link href="/#" color="foreground" size="sm">
              首页
            </Link>
            <Link href="/#" color="foreground" size="sm">
              定价
            </Link>
            <Link href="/#" color="foreground" size="sm">
              关于
            </Link>
          </div>

          {/* 资源部分 */}
          <div className="flex flex-col gap-2">
            <p className="font-medium text-default-700">资源</p>
            <Link href="/#" color="foreground" size="sm">
              博客
            </Link>
            <Link href="/#" color="foreground" size="sm">
              帮助中心
            </Link>
            <Link href="/#" color="foreground" size="sm">
              联系我们
            </Link>
          </div>

          {/* 法律部分 */}
          <div className="flex flex-col gap-2">
            <p className="font-medium text-default-700">法律</p>
            <Link href="/#" color="foreground" size="sm">
              隐私政策
            </Link>
            <Link href="/#" color="foreground" size="sm">
              使用条款
            </Link>
          </div>

          {/* 社交媒体部分 */}
          <div className="flex flex-col gap-2">
            <p className="font-medium text-default-700">社交媒体</p>
            <div className="flex gap-4">
              
              {/* 可以添加更多社交媒体图标 */}
            </div>
          </div>
        </div>

        {/* 底部版权信息 */}
        <Divider className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-small text-default-500">
            &copy; {new Date().getFullYear()} ShortNovel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
