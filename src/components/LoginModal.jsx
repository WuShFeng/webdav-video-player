// components/LoginModal.jsx
"use client";
import { useState } from "react";
import { useWebdavStore } from "@/store/useWebdavStore";

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, setCredentials } =
    useWebdavStore();
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleLogin = () => {
    setLoading(true);
    fetch("/api/webdav/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, username, password }),
    })
      .then((res) => res.json())
      .then(({ success }) => {
        if (success) setCredentials(url, username, password);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-lg font-bold mb-4">登录</h2>
        <input
          placeholder="地址"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
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
