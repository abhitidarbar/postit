import { useState, useEffect } from "react";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { getObjectFromStringResponse } from "../utils/regex";
import { defaultAddressKey } from "../types/types";
import { saveToLocalStorage } from "../utils/localstorage";
import Link from "next/link";
import { getFromLocalStorage } from "../utils/localstorage";
import config from "../config/config";
export default function Sidebar() {
  const [user, setUser] = useState({});
  const [adenaStatus, setAdenaStatus] = useState("failure");
  const provider = new GnoJSONRPCProvider(config.GNO_JSONRPC_URL);
  const [loading, setLoading] = useState(true);

  const connectWallet = async () => {
    //look for the adena object
    if (!window.adena) {
      //open adena.app in a new tab if the adena object is not found
      window.open("https://adena.app/", "_blank");
    } else {
      await adena.AddEstablish("Adena");
    }
  };

  const setAccount = async () => {
    if (window.adena) {
      let res = await window.adena.GetAccount();
      if (res) {
        saveToLocalStorage(defaultAddressKey, res.data?.address);
        setAdenaStatus(res.status);
      }
    }
  };

  // make sure to call this only after setAccount
  const getUser = async () => {
    const address = getFromLocalStorage(defaultAddressKey);
    try {
      const res = await provider.evaluateExpression(
        config.GNO_POSTIT_REALM,
        `GetUserByAddress("${address.toString()}")`
      );
      const response = getObjectFromStringResponse(res);
      setUser(response);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };
  useEffect(() => {
    setAccount().then(() => {
      getUser();
    });
  }, []);
  return (
    <div className="flex flex-col sticky top-5 items-center">
      <a href="/" rel="noreferrer">
        <span className="flex flex-row justify-center mb-4 w-48">
          <div className="font-bold">POST</div>
          <div className="font-bold">.</div>
          <div className="text-sky-500 font-bold">it</div>
        </span>
      </a>
      {loading ? (
        <div className="flex flex-col items-center h-screen mt-12">
          <span className="loading loading-spinner loading-md bg-sky-500"></span>
        </div>
      ) : user?.Address?.length > 0 ? (
        <div className="flex flex-col">
          <a
            className="text-white hover:bg-gray-800 font-bold rounded-full text-lg px-7 py-2.5 text-left mb-2 w-fit"
            href="/"
            rel="noreferrer"
          >
            Home
          </a>
          <a
            className="text-white hover:bg-gray-800 font-bold rounded-full text-lg px-7 py-2.5 text-left mb-2 w-fit"
            href={"/" + user.Username}
            rel="noreferrer"
          >
            Profile
          </a>
          <a
            className="text-white hover:bg-gray-800 font-bold rounded-full text-lg px-7 py-2.5 text-left mb-2 w-fit"
            href={"/search"}
            rel="noreferrer"
          >
            Explore
          </a>
          <a className="" rel="noreferrer" href={"/" + user.Username}>
            <button className="flex hover:bg-gray-600 rounded-full w-60 py-2">
              <img
                className="w-10 h-10 rounded-full mt-1 ml-3"
                src={
                  user.Avatar?.startsWith("data:image/")
                    ? user.Avatar
                    : "./default-user-avatar.png"
                }
                alt="Rounded avatar"
              />
              <div className="ml-3 flex flex-col items-start">
                <div className="text-white font-bold">
                  {user.Name.length < 16
                    ? user.Name
                    : user.Name.substring(0, 16) + "..."}
                </div>
                <div className="text-gray-500">
                  {user.Username.length < 16
                    ? user.Username
                    : user.Username.substring(0, 16) + "..."}
                </div>
              </div>
            </button>
          </a>
        </div>
      ) : adenaStatus === "success" ? (
        <>
          <Link
            href={"/createUser"}
            className="text-white bg-sky-500 hover:bg-sky-600 font-bold rounded-full text-md px-6 py-2.5 text-center mb-2 w-48"
          >
            Create Profile
          </Link>
        </>
      ) : (
        <button
          className="text-white bg-sky-500 hover:bg-sky-600 font-bold rounded-full text-md px-6 py-2.5 text-center mb-2 w-48"
          onClick={() => {
            connectWallet().then(() => {
              setAccount();
            });
          }}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
