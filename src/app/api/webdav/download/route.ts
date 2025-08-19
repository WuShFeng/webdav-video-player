import { NextResponse } from "next/server";
import { createClient } from "webdav";
import { Readable } from "stream";

export async function GET(request: Request) {
  const urlObj = new URL(request.url);
  const webdavUrl = urlObj.searchParams.get("url")!;
  const username = urlObj.searchParams.get("username")!;
  const password = urlObj.searchParams.get("password")!;
  const path = urlObj.searchParams.get("path")!;

  const client = createClient(webdavUrl, { username, password });
  const range = request.headers.get("range");

  try {
    const nodeStream = await client.createReadStream(path, {
      headers: range ? { Range: range } : undefined,
    });

    const statResult = await client.stat(path);
    let size: number;
    if ("size" in statResult) {
      size = statResult.size;
    } else if (
      "data" in statResult &&
      Array.isArray(statResult.data) &&
      statResult.data[0]
    ) {
      size = statResult.data[0].size;
    } else {
      size = 0;
    }

    // Node Readable 转 Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk) => controller.enqueue(chunk));
        nodeStream.on("end", () => controller.close());
        nodeStream.on("error", (err) => controller.error(err));
      },
    });

    const headers: Record<string, string> = {
      "Content-Type": "application/octet-stream",
      "Accept-Ranges": "bytes",
      "Content-Disposition": `attachment; filename="${path.split("/").pop()}"`,
      "Content-Length": size.toString(),
    };
    if (range) headers["Content-Range"] = range;

    return new Response(webStream, { headers, status: range ? 206 : 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : err },
      { status: 500 }
    );
  }
}
