'use client'
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoSrc, setVideoSrc] = useState("");

  const handlePlay = () => {
    if (url.trim()) {
      setVideoSrc(url.trim());
    }
  };
  return (
    <main className="flex flex-col gap-6 w-full max-w-xl">
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Player
      </h1>
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
