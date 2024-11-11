'use client';

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User
} from "@nextui-org/react";
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@nextui-org/button";
import Link from 'next/link';

interface UserDropdownProps {
  user?: any;
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (!user) {
    return (
      <Button 
        as={Link} 
        href="/signin" 
        variant="flat" 
        color="default"
        size="sm"
      >
        登录
      </Button>
    );
  }

  const handleLogout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleRequest(e, SignOut, router);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: user.user_metadata?.avatar_url || 'https://i.pravatar.cc/150',
            size: "sm",
          }}
          className="transition-transform"
          description={user.email}
          name={user.user_metadata?.full_name || user.email?.split('@')[0]}
          classNames={{
            description: "hidden sm:block",
            name: "hidden sm:block",
          }}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="用户菜单">
        {/* <DropdownItem 
          key="profile" 
          onPress={() => handleNavigation('/account')}
        >
          账户设置
        </DropdownItem> */}
        <DropdownItem 
          key="settings" 
          onPress={() => handleNavigation('/pricing')}
        >
          订阅管理
        </DropdownItem>
        <DropdownItem 
          key="logout" 
          color="danger"
        >
          <form onSubmit={handleLogout}>
            <input type="hidden" name="pathName" value={pathname} />
            <button type="submit" className="w-full text-left">
              退出登录
            </button>
          </form>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
} 