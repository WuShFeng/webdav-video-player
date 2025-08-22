"use client";

import FileDetailSidebar from "@/components/FileDetailSidebar";
import FileExplorer from "@/components/FileExplorer";
import LoginModal from "@/components/LoginModal";
import { useWebdavStore } from "@/store/useWebdavStore";

export default function Home() {
  const { openLoginModal, isLoggedIn, logout } = useWebdavStore();
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
        className={`px-4 py-2 rounded-lg transition ${
          isLoggedIn
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        {isLoggedIn ? "登出" : "登录"}
      </button>
      {isLoggedIn && <FileExplorer />}
      {isLoggedIn && <FileDetailSidebar />}
    </main>
  );
}
