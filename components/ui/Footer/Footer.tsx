import { Link } from "@nextui-org/link";
import { Divider } from "@nextui-org/divider";

export default function Footer() {
  return (
    <footer className="w-full">
      <Divider className="my-4" />
      <div className="mx-auto max-w-[1920px] px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {/* Logo Section */}
          <div className="col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <p className="font-bold text-inherit">ShortNovel</p>
            </Link>
            <p className="mt-4 text-small text-default-500">
              Discover amazing short stories and start your reading journey.
            </p>
          </div>

          {/* Product Section */}
          <div className="flex flex-col gap-2">
            <p className="font-medium text-default-700">Product</p>
            <Link href="/#" color="foreground" size="sm">
              Home
            </Link>
            <Link href="/#" color="foreground" size="sm">
              Pricing
            </Link>
            <Link href="/#" color="foreground" size="sm">
              About
            </Link>
          </div>

          {/* Resources Section */}
          <div className="flex flex-col gap-2">
            <p className="font-medium text-default-700">Resources</p>
            <Link href="/#" color="foreground" size="sm">
              Blog
            </Link>
            <Link href="/#" color="foreground" size="sm">
              Help Center
            </Link>
            <Link href="/#" color="foreground" size="sm">
              Contact Us
            </Link>
          </div>

          {/* Legal Section */}
          <div className="flex flex-col gap-2">
            <p className="font-medium text-default-700">Legal</p>
            <Link href="/#" color="foreground" size="sm">
              Privacy Policy
            </Link>
            <Link href="/#" color="foreground" size="sm">
              Terms of Service
            </Link>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col gap-2">
            <p className="font-medium text-default-700">Social Media</p>
            <div className="flex gap-4">
              {/* Add more social media icons here */}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <Divider className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-small text-default-500">
            &copy; {new Date().getFullYear()} NovelShort. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
