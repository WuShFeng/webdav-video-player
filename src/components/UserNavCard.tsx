"use client";

import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import { useState } from "react";
export default function UserNavCard() {
  const { userName, userPicture } = useUserStore();
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative flex items-center gap-3 ">
      {userName}
      <div className="w-8 relative h-8">
        {loaded ? (
          <Image src={userPicture} alt="" width={40} height={40} />
        ) : (
          <div className="absolute inset-0 rounded-full bg-gray-200 animate-pulse" />
        )}
      </div>
    </div>
  );
}
