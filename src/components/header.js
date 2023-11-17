"use client";
import { useState } from "react";
export default function Header() {
  const [content, setContent] = useState("");

  const handleInput = (e) => {
    setContent(e.target.value);
  };
  return (
    <div className="flex flex-col">
      <span className="flex ml-4">
        <img
          class="w-10 h-10 rounded-full"
          src="./favicon.ico"
          alt="Rounded avatar"
        />

        <textarea
          type="type"
          value={content}
          className="ml-2 text-white bg-black p-2 border-none w-96 focus:border-none outline-none resize-none"
          placeholder="What's happening?!"
          onChange={(e) => {
            handleInput(e);
          }}
        ></textarea>
      </span>

      <div className="mt-4 ml-auto mr-4">
        <button
          type="button"
          className="text-white bg-sky-500 hover:bg-sky-600 font-bold rounded-full text-md px-5 py-1.5 text-center mb-2"
        >
          Post
        </button>
      </div>
      <hr className="w-full border-l border-gray-200 opacity-25 sticky"></hr>
    </div>
  );
}
