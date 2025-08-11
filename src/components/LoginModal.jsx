// components/LoginModal.jsx
"use client";
import { useState } from "react";
import { useWebdavStore } from "@/store/useWebdavStore";
// import { testWebdavConnection } from '@/lib/webdav';

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, setCredentials } =
    useWebdavStore();
  const [webdavUrl, setWebdavUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleLogin = async () => {
    setLoading(true);
    // const ok = await testWebdavConnection(webdavUrl, username, password);
    const ok = false;
    setLoading(false);
    if (ok) {
      setCredentials(webdavUrl, username, password);
    } else {
      alert("登录失败");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      1
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-lg font-bold mb-4">登录 WebDAV</h2>
        <input
          placeholder="WebDAV 地址"
          value={webdavUrl}
          onChange={(e) => setWebdavUrl(e.target.value)}
          className="border px-3 py-2 rounded w-full mb-2"
        />
        <input
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border px-3 py-2 rounded w-full mb-2"
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded w-full mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={closeLoginModal}
            className="px-4 py-2 rounded border"
          >
            取消
          </button>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </div>
      </div>
    </div>
  );
}
