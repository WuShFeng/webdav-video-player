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

  // 获取文件信息
  const stat = await client.stat(path);
  const fileSize = (stat as FileStat).size;

  const rangeHeader = request.headers.get("range");
  let start = 0;
  let end = fileSize - 1;
  let status = 200;

  if (rangeHeader) {
    const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
    if (match) {
      if (match[1]) start = parseInt(match[1]);
      if (match[2]) end = parseInt(match[2]);
    }
    status = 206; // Partial Content
  }

  const stream = client.createReadStream(path, { range: { start, end } });

  const headers = new Headers();
  headers.set("Content-Length", (end - start + 1).toString());
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Type", "application/octet-stream");
  headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);

  console.log(headers);
  const webStream = new ReadableStream({
    async start(controller) {
      stream.on("data", (chunk) => controller.enqueue(chunk));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
    async cancel() {
      stream.destroy();
    },
  });

  return new NextResponse(webStream, { status, headers });
}
