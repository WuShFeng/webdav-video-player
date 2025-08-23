"use client";

import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import getCasdoorSDK from "@/lib/casdoor";
import { useState } from "react";
export default function UserNavCard() {
  const { userName, userPicture, logout } = useUserStore();
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative flex items-center gap-3 ">
      {userName}
      <div className="w-8 relative h-8">
        {!loaded && (
          <div className="absolute inset-0 rounded-full bg-gray-200 animate-pulse" />
        )}
        {userPicture && (
          <Image
            className={`rounded-full transition-opacity duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            src={userPicture}
            alt=""
            width={40}
            height={40}
            onLoadingComplete={() => setLoaded(true)}
          />
        )}
      </div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => logout()}
      >
        登出
      </button>
    </div>
  );
}
