import { NextResponse } from "next/server";
import { createClient, FileStat } from "webdav";

const url = process.env.webdavUrl as string;
const username = process.env.webdavUsername as string;
const password = process.env.webdavPassword as string;
const client = createClient(url, { username, password });

export async function GET(request: Request) {
  const urlObj = new URL(request.url);
  const path = urlObj.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }
  try {
    const stat = (await client.stat(path)) as FileStat;
    return NextResponse.json({
      basename: stat.basename,
      filename: stat.filename,
      type: stat.type, // "file" or "directory"
      size: stat.size,
      lastmod: stat.lastmod, // ISO string
      etag: stat.etag,
      mime: stat.mime, // 文件类型（可能为空）
    });
  } catch (error) {
    console.error("Failed to get file detail:", error);
    return NextResponse.json(
      { error: "Failed to get file detail" },
      { status: 500 }
    );
  }
}
