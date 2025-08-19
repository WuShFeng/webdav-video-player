import { createClient, WebDAVClient } from "webdav";
import { useWebdavStore } from "@/store/useWebdavStore";

let cachedClient: WebDAVClient | null = null;

export function useWebdavClient() {
  const { webdavUrl, username, password, isLoggedIn } = useWebdavStore();

  if (!isLoggedIn || !webdavUrl || !username || !password) {
    return null;
  }

  // 如果已有 client，直接返回
  if (cachedClient) return cachedClient;

  // 否则新建并缓存
  cachedClient = createClient(webdavUrl, { username, password });
  return cachedClient;
}
