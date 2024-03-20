"use client";
import Sidebar from "../components/sidebar";
import Content from "../components/content";
import Trending from "../components/trending";
import { getFromLocalStorage } from "../utils/localstorage";
import { defaultAddressKey } from "../types/types";
import { useState, useEffect } from "react";
import Loading from "../components/loading";
export default function Home() {
  const [refresh, setRefresh] = useState(0);
  const [wallet, setWallet] = useState("");
  const [load, setLoad] = useState(true);

  async function checkMnemonic() {
    const m = await getFromLocalStorage(defaultAddressKey);
    setWallet(m);
    setLoad(false);
  }

  useEffect(() => {
    checkMnemonic();
  });

  return load ? (
    <Loading />
  ) : (
    <div>
      <div className="sm:hidden text-xs absolute top-0 bg-sky-500 w-full flex items-center justify-center">
        <div> Mobile devices may not fully support all functionalities</div>
      </div>
      <div className="flex w-screen bg-black">
        <div className="w-1/12 p-4"></div>
        <div className="w-1/4 p-4 hidden sm:inline">
          <Sidebar />
        </div>
        <hr className="h-screen border-l border-gray-200 opacity-25 sticky top-0 hidden sm:inline"></hr>
        <div className="w-full sm:w-1/2 py-4">
          <Content refresh={refresh} setRefresh={setRefresh} />
        </div>
        <hr className="h-screen border-l border-gray-200 opacity-25 sticky top-0 hidden sm:inline"></hr>
        <div className="w-1/4 p-4 hidden sm:inline">
          <Trending refresh={refresh} />
        </div>
        <div className="w-1/6 p-4"></div>
      </div>
    </div>
  );
}
