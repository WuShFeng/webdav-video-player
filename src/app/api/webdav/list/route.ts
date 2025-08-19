import { NextResponse } from "next/server";
import { createClient } from "webdav";
const url = process.env.webdavUrl as string;
const username = process.env.webdavUsername as string;
const password = process.env.webdavPassword as string;

export async function GET(request: Request) {
  const urlObj = new URL(request.url);
  const path = urlObj.searchParams.get("path")!;
  const client = createClient(url, { username, password });
  const res = await client.getDirectoryContents(path);
  return NextResponse.json(res);
}
