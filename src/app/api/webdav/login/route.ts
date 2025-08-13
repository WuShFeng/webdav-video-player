import { NextResponse } from "next/server";
import { createClient } from "webdav";

export async function GET() {
  const url = "https://alist.wushf.top/dav";
  const username = "admin";
  const password = "2oFsT2Sy";
  const client = createClient(url, { username, password });
  try {
    const res = await client.getDirectoryContents("/");
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json(error);
  }
}
export async function POST(request: Request) {
  const { url, username, password } = await request.json();
  const client = createClient(url, { username, password });
  try {
    await client.getDirectoryContents("/");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
