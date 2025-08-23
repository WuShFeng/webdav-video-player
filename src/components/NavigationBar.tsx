"use client";

import LoginButton from "@/components/LoginButton";
import UserNavCard from "@/components/UserNavCard";
import { useUserStore } from "@/store/useUserStore";
import { usePathname } from "next/navigation";

interface NavigationBar {
  label: string;
  href: string;
}

const navItems: NavigationBar[] = [
  { label: "首页", href: "/" },
  { label: "关于", href: "/about" },
  { label: "博客", href: "/blog" },
  { label: "联系", href: "/contact" },
];

export default function NavigationBar() {
  const pathname = usePathname();
  const { isLoggedIn } = useUserStore();
  return (
    <nav className="bg-blue-600 text-white px-5 py-3 shadow-md flex items-center sticky">
      <h1 className="text-2xl font-bold text-center text-white">Player</h1>
      <div className="ml-auto ">
        {isLoggedIn ? <UserNavCard /> : <LoginButton />}
      </div>
    </nav>
  );
}
