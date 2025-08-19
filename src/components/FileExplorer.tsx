"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "webdav";
import { useWebdavStore } from "@/store/useWebdavStore";
import axios from "axios";

interface FileItem {
  basename: string;
  type: "file" | "directory";
  filename: string;
}

export default function FileExplorer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { url, username, password } = useWebdavStore();
  const client = createClient(url, { username, password });

  const currentPath = searchParams.get("path") || "/";

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    axios
      .get<FileItem[]>(`/api/webdav/list?path=${currentPath}`, {
        signal: controllerRef.current.signal,
      })
      .then((res) => {
        setFiles(res.data);
      })
      .catch(() => {
        setFiles([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPath]);
  useEffect(() => {
    fetchFiles();
  }, [currentPath, fetchFiles]);

  if (!client) return <p>请先登录</p>;
  const handleClick = (file: FileItem) => {
    if (file.type === "directory") {
      router.push(`/?path=${encodeURIComponent(file.filename)}`);
    } else if (file.type === "file") {
      const urlParams = new URLSearchParams({
        path: file.filename
      });

      window.open(`/api/webdav/download?${urlParams.toString()}`, "_blank");
    }
  };

  // 生成面包屑
  const buildBreadcrumbs = () => {
    const parts = currentPath.split("/").filter(Boolean);
    const breadcrumbs = [{ name: "🏠 根目录", path: "/" }];

    let pathAcc = "";
    for (const part of parts) {
      pathAcc += "/" + part;
      breadcrumbs.push({ name: part, path: pathAcc });
    }
    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow">
      {/* 面包屑导航 */}
      <div className="flex flex-wrap items-center text-sm mb-4">
        {breadcrumbs.map((bc, index) => (
          <span key={bc.path} className="flex items-center">
            <button
              onClick={() =>
                router.push(`/?path=${encodeURIComponent(bc.path)}`)
              }
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

      {/* 文件列表或骨架屏 */}
      {loading ? (
        <ul className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="h-6 bg-gray-300 rounded animate-pulse"></li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-1">
          {files.map((f) => (
            <li
              key={f.filename}
              className={`flex items-center gap-2 cursor-pointer ${
                f.type === "directory" ? "text-blue-600 hover:underline" : ""
              }`}
              onClick={() => handleClick(f)}
            >
              {f.type === "directory" ? "📁" : "📄"} {f.basename}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
