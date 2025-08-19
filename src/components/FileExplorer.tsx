"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useWebdavClient } from "@/lib/webdavClient";

interface FileItem {
    basename: string;
    type: "file" | "directory";
    filename: string;
}

export default function FileExplorer() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const client = useWebdavClient();

    // 取查询参数里的路径，默认 "/"
    const currentPath = searchParams.get("path") || "/";

    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!client) return;

        async function fetchFiles() {
            setLoading(true);
            try {
                const list = await client.getDirectoryContents(currentPath);
                setFiles(list as FileItem[]);
            } catch (err) {
                console.error("加载失败:", err);
                setFiles([]);
            }
            setLoading(false);
        }
        fetchFiles();
    }, [client, currentPath]);

    if (!client) return <p>请先登录</p>;

    const handleClick = (file: FileItem) => {
        if (file.type === "directory") {
            // 点击目录时，修改 URL 的 query 参数
            router.push(`/?path=${encodeURIComponent(file.filename)}`);
        }
    };

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-2">当前路径: {currentPath}</h2>
            {loading ? (
                <p>加载中...</p>
            ) : (
                <ul className="space-y-1">
                    {files.map((f) => (
                        <li
                            key={f.filename}
                            className={`flex items-center gap-2 cursor-pointer ${f.type === "directory" ? "text-blue-600 hover:underline" : ""
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
