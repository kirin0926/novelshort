import { createClient } from '@/utils/supabase/server';
import Navlinks from './Navlinks';
import { 
  Navbar as NextUINavbar, 
  NavbarBrand, 
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import Logo from '@/components/icons/Logo';
import UserDropdown from './UserDropdown';

// 主 Navbar 组件
export default async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <NextUINavbar 
      maxWidth="xl" 
      position="sticky"
      className="border-b backdrop-blur-lg backdrop-saturate-150 bg-background/70"
    >
      <NavbarContent className="gap-4">
        <NavbarMenuToggle className="sm:hidden" />
        <NavbarBrand>
          <Link href="/" color="foreground">
            <Logo />
          </Link>
        </NavbarBrand>
        <div className="hidden sm:flex">
          <Navlinks user={user} />
        </div>
      </NavbarContent>

      <NavbarContent justify="end">
        <UserDropdown user={user} />
      </NavbarContent>

      <NavbarMenu>
        <Navlinks user={user} isMobile />
      </NavbarMenu>
    </NextUINavbar>
  );
}
