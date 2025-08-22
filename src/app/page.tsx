"use client";

import FileExplorer from "@/components/FileExplorer";

export default function Home() {
  return (
    <main className="flex flex-col gap-6 w-full max-w-xl mx-auto p-4 relative">
      <FileExplorer />
    </main>
  );
}
