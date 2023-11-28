"use client";
import Sidebar from "../components/sidebar";
import Content from "../components/content";
import Trending from "../components/trending";
import { useState } from "react";
export default function Home() {
  const [refresh, setRefresh] = useState(0);
  return (
    <div className="flex w-screen bg-black">
      <div className="w-1/6 p-4"></div>
      <div className="w-1/4 p-4">
        <Sidebar />
      </div>
      <hr className="h-screen border-l border-gray-200 opacity-25 sticky top-0"></hr>
      <div className="w-1/2 py-4">
        <Content refresh={refresh} setRefresh={setRefresh} />
      </div>
      <hr className="h-screen border-l border-gray-200 opacity-25 sticky top-0"></hr>
      <div className="w-1/4 p-4">
        <Trending refresh={refresh} />
      </div>
      <div className="w-1/6 p-4"></div>
    </div>
  );
}
