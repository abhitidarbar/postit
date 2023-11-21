"use client";
import Sidebar from "../components/sidebar";
import Content from "../components/content";
import Trending from "../components/trending";
import { useState } from "react";
export default function Home() {
  const [load, setLoad] = useState(1);
  //  **Load States**
  //  1 - Homepage
  //  2 - Profile
  return (
    <div className="flex w-screen bg-black">
      <div className="w-1/4 p-4">
        <Sidebar />
      </div>
      <hr className="h-screen border-l border-gray-200 opacity-25 sticky top-0"></hr>
      {load === 1 ? (
        <div className="w-1/2 py-4">
          <Content />
        </div>
      ) : (
        <div>Profile</div>
      )}
      <hr className="h-screen border-l border-gray-200 opacity-25 sticky top-0"></hr>
      <div className="w-1/4 p-4">
        <Trending />
      </div>
    </div>
  );
}
