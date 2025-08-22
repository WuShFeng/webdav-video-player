"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
interface FileDetail {
  basename: string;
  filename: string;
  type: "file" | "directory";
  size: number;
  lastmod: string;
  etag: string;
  mime?: string;
}

interface FileDetailSidebarProps {
  onClose?: () => void;
}

export default function FileDetailSidebar({ onClose }: FileDetailSidebarProps) {
  const searchParams = useSearchParams();
  const [detail, setDetail] = useState<FileDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const currentPath = searchParams.get("path") || "/";
  useEffect(() => {
    if (!currentPath) return setDetail(null);

    setLoading(true);
    axios
      .get<FileDetail>(`/api/webdav/detail`, {
        params: { path: currentPath },
      })
      .then((res) => setDetail(res.data))
      .catch(() => {
        setDetail(null);
      })
      .finally(() => setLoading(false));
  }, [currentPath]);

  if (!currentPath) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-gray-50 shadow-lg p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">文件详情</h2>
        {onClose && (
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            ✕
          </button>
        )}
      </div>

      {loading ? (
        <p>加载中...</p>
      ) : detail ? (
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">文件名：</span>
            {detail.basename}
          </p>
          <p>
            <span className="font-semibold">路径：</span>
            {detail.filename}
          </p>
          <p>
            <span className="font-semibold">类型：</span>
            {detail.type}
          </p>
          {detail.type === "file" && (
            <>
              <p>
                <span className="font-semibold">大小：</span>
                {detail.size < 1024
                  ? `${detail.size} B`
                  : detail.size < 1024 * 1024
                  ? `${(detail.size / 1024).toFixed(2)} KB`
                  : `${(detail.size / 1024 / 1024).toFixed(2)} MB`}
              </p>
              <p>
                <span className="font-semibold">修改时间：</span>
                {new Date(detail.lastmod).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">MIME：</span>
                {detail.mime || "-"}
              </p>
            </>
          )}
        </div>
      ) : (
        <p>无法获取文件详情</p>
      )}
    </div>
  );
}
