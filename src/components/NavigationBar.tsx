"use client";

import Link from "next/link";
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

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-center text-white">Player</h1>
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`hover:text-yellow-300 ${
                  pathname === item.href ? "text-yellow-300 font-semibold" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
