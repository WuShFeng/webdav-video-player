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
  const stream = client.createReadStream(path, { range: { start, end } });
  const fileName = path.split("/").pop() || "download";
  const headers = new Headers();
  if (rangeHeader) {
    const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
    if (match) {
      if (match[1]) start = parseInt(match[1]);
      if (match[2]) end = parseInt(match[2]);
    }
    if (start >= fileSize || end >= fileSize || start > end) {
      return new Response(JSON.stringify({ error: "Range Not Satisfiable" }), {
        status: 416,
        headers: {
          "Content-Range": `bytes */${fileSize}`, // 必须告知文件总大小
        },
      });
    }
    status = 206;
    headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
  }
  headers.set("Content-Type", "application/octet-stream");
  headers.set(
    "Content-Disposition",
    `attachment; filename="${encodeURI(fileName)}"`
  );
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Length", (end - start + 1).toString());
  return new NextResponse(nodeToWebReadableStream(stream), { status, headers });
}
