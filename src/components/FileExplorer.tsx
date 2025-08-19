"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useWebdavClient } from "@/lib/webdavClient";

interface FileItem {
    basename: string;
    type: "file" | "directory";
    filename: string; // WebDAV 返回的完整路径
}

export default function FileExplorer() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const client = useWebdavClient();

    // 当前路径（从 URL query 参数取，默认 "/"）
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

    // 点击目录时进入下一级
    const handleClick = (file: FileItem) => {
        if (file.type === "directory") {
            router.push(`/?path=${encodeURIComponent(file.filename)}`);
        }
    };

    // 返回上一级
    const handleGoUp = () => {
        if (currentPath === "/" || currentPath === "") return; // 已经是根目录

        // 去掉最后一个路径段
        const parts = currentPath.split("/").filter(Boolean); // 去掉空字符串
        parts.pop(); // 删除最后一级
        const parentPath = "/" + parts.join("/");

        router.push(`/?path=${encodeURIComponent(parentPath || "/")}`);
    };

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">当前路径: {currentPath}</h2>
                {currentPath !== "/" && (
                    <button
                        onClick={handleGoUp}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        ⬆ 返回上一级
                    </button>
                )}
            </div>

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
