// components/LoginModal.jsx
"use client";
import getCasdoorSDK from "@/lib/casdoor";
import { useUserStore } from "@/store/useUserStore";
export default function LoginButton() {
  const { setRedirectPath } = useUserStore();
  const handleLogin = () => {
    const fullPath = window.location.href;
    console.log(window.location.href);
    setRedirectPath(fullPath);
    getCasdoorSDK().signin_redirect(); // 跳转到 Casdoor 登录页面
  };

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      登录
    </button>
  );
}
