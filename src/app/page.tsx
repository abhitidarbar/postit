"use client";
import Sidebar from "../components/sidebar";
import Content from "../components/content";
import Trending from "../components/trending";
import { useState } from "react";
export default function Home() {
  return (
    <div className="flex w-screen bg-black">
      <div className="w-1/4 p-4">
        <Sidebar />
      </div>
      <hr className="h-screen border-l border-gray-200 opacity-25 sticky top-0"></hr>
      <div className="w-1/2 py-4">
        <Content />
      </div>
      <hr className="h-screen border-l border-gray-200 opacity-25 sticky top-0"></hr>
      <div className="w-1/4 p-4">
        <Trending />
      </div>
    </div>
  );
}
