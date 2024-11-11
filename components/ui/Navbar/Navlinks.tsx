'use client';

import { usePathname } from 'next/navigation';
import { NavbarItem, NavbarMenuItem } from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";

interface NavlinksProps {
  user?: any;
  isMobile?: boolean;
}

export default function Navlinks({ user, isMobile = false }: NavlinksProps) {
  const pathname = usePathname();
  const NavItem = isMobile ? NavbarMenuItem : NavbarItem;
  
  const linkStyles = isMobile ? {
    className: "w-full",
    size: "md" as const
  } : {
    color: "foreground" as const,
    className: "text-sm"
  };

  return (
    <div className={isMobile ? "" : "flex gap-4 items-center"}>
      <NavItem isActive={pathname === "/"}>
        <Link href="/" {...linkStyles}>
          Home
        </Link>
      </NavItem>
      <NavItem isActive={pathname === "/pricing"}>
        <Link href="/pricing" {...linkStyles}>
        pricing
        </Link>
      </NavItem>
      {user && (
        <NavItem isActive={pathname === "/account"}>
          <Link href="/account" {...linkStyles}>
          account
          </Link>
        </NavItem>
      )}
    </div>
  );
}
