"use client";

import FileDetailSidebar from "@/components/FileDetailSidebar";
import FileExplorer from "@/components/FileExplorer";
import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <main className="flex flex-col gap-6 w-full max-w-xl mx-auto p-4 relative">
      <LoginButton />
      <FileExplorer />
      <FileDetailSidebar />
    </main>
  );
}
