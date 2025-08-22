"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  currentPath: string;
}

export default function Breadcrumbs({ currentPath }: BreadcrumbsProps) {
  const router = useRouter();

  // 生成面包屑数组
  const breadcrumbs = useMemo(() => {
    const parts = currentPath.split("/").filter(Boolean);
    const crumbs: BreadcrumbItem[] = [{ name: "🏠 根目录", path: "/" }];
    let pathAcc = "";
    for (const part of parts) {
      pathAcc += "/" + part;
      crumbs.push({ name: part, path: pathAcc });
    }
    return crumbs;
  }, [currentPath]);

  return (
    <div className="flex flex-wrap items-center text-sm mb-4">
      {breadcrumbs.map((bc, index) => (
        <span key={bc.path} className="flex items-center">
          <button
            onClick={() => router.push(`/?path=${encodeURIComponent(bc.path)}`)}
            className="text-blue-600 hover:underline"
          >
            {bc.name}
          </button>
          {index < breadcrumbs.length - 1 && (
            <span className="mx-1 text-gray-500">{"/"}</span>
          )}
        </span>
      ))}
    </div>
  );
}
