import { NextResponse } from "next/server";
import { createClient, FileStat } from "webdav";
import { nodeToWebReadableStream } from "@/lib/stream";
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

  // 获取文件信息
  const stat = (await client.stat(path)) as FileStat;
  const fileSize = stat.size;
  // 默认下载整个文件
  let start = 0;
  let end = fileSize - 1;
  const rangeHeader = request.headers.get("range");
  let status = 200;
  const headers = new Headers();
  if (rangeHeader) {
    const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
    if (match) {
      if (match[1] && match[2]) {
        // bytes=100-200
        start = parseInt(match[1]);
        end = parseInt(match[2]);
      } else if (match[1] && !match[2]) {
        // bytes=100-
        start = parseInt(match[1]);
        end = fileSize - 1;
      } else if (!match[1] && match[2]) {
        // bytes=-500  (最后500字节)
        start = fileSize - parseInt(match[2]);
        end = fileSize - 1;
      }
    }
    status = 206;
    headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
  }
  const stream = client.createReadStream(path, { range: { start, end } });
  const fileName = path.split("/").pop() || "download";

  headers.set("Content-Type", "application/octet-stream");
  headers.set(
    "Content-Disposition",
    `attachment; filename="${encodeURI(fileName)}"`
  );
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Length", (end - start + 1).toString());
  return new NextResponse(nodeToWebReadableStream(stream), { status, headers });
}
