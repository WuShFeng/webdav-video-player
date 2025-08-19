import { NextResponse } from "next/server";
import { createClient } from "webdav";
import cache from "@/lib/cache";
const url = process.env.webdavUrl as string;
const username = process.env.webdavUsername as string;
const password = process.env.webdavPassword as string;

export async function GET(request: Request) {
  const urlObj = new URL(request.url);
  const path = urlObj.searchParams.get("path")!;
  const cacheKey = `webdav:${path}`;
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  const client = createClient(url, { username, password });
  const res = await client.getDirectoryContents(path);
  await cache.set(cacheKey, NextResponse.json(res));
  return NextResponse.json(res);
}
