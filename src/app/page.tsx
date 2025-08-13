"use client";

import { useState } from "react";
import LoginModal from "@/components/LoginModal";
import { useWebdavStore } from "@/store/useWebdavStore";

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const { openLoginModal, isLoggedIn, logout } = useWebdavStore();

  const handlePlay = () => {
    if (url.trim()) {
      setVideoSrc(url.trim());
    }
  };
  const handleAuthButton = () => {
    if (isLoggedIn) {
      logout(); // 登出操作
    } else {
      openLoginModal(); // 打开登录弹窗
    }
  };
  return (
    <main className="flex flex-col gap-6 w-full max-w-xl mx-auto p-4">
      <LoginModal />

      <h1 className="text-2xl font-bold text-gray-800 text-center">Player</h1>
      <button
        onClick={handleAuthButton}
        className={`px-4 py-2 rounded-lg transition ${isLoggedIn
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-green-500 text-white hover:bg-green-600"
          }`}
      >
        {isLoggedIn ? "登出" : "登录"}
      </button>

      <input
        type="text"
        placeholder="输入视频链接..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handlePlay}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        播放视频
      </button>

      {videoSrc && (
        <video
          controls
          src={videoSrc}
          className="w-full rounded-lg shadow-lg"
        />
      )}
    </main>
  );
}
