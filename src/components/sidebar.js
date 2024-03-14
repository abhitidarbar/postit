import { useState, useEffect } from "react";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { getObjectFromStringResponse } from "../utils/regex";
import { defaultAddressKey } from "../types/types";
import { saveToLocalStorage } from "../utils/localstorage";
import Link from "next/link";
import { getFromLocalStorage } from "../utils/localstorage";
export default function Sidebar() {
  const [user, setUser] = useState({});
  const [adenaStatus, setAdenaStatus] = useState("failure");
  const provider = new GnoJSONRPCProvider("http://localhost:26657");

  const connectWallet = async () => {
    //look for the adena object
    if (!window.adena) {
      //open adena.app in a new tab if the adena object is not found
      window.open("https://adena.app/", "_blank");
    } else {
      //write your logic here
      //the sample code below displays a method provided by Adena that initiates a connection
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
        "gno.land/r/demo/postit",
        `GetUserByAddress("${address.toString()}")`
      );
      const response = getObjectFromStringResponse(res);
      setUser(response);
    } catch (e) {
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
      <span className="flex flex-row justify-center mb-4 w-48">
        <div className="font-bold">POST</div>
        <div className="font-bold">.</div>
        <div className="text-sky-500 font-bold">it</div>
      </span>

      {user?.Address?.length > 0 ? (
        <div className="flex flex-col">
          <a
            className="text-white hover:bg-gray-800 font-bold rounded-full text-lg px-10 py-2.5 text-center mb-2 w-48"
            href="/"
            rel="noreferrer"
          >
            Home
          </a>
          <a
            className="text-white hover:bg-gray-800 font-bold rounded-full text-lg px-10 py-2.5 text-center mb-2 w-48"
            href={"/" + user.Username}
            rel="noreferrer"
          >
            Profile
          </a>
          <a
            className="text-white hover:bg-gray-800 font-bold rounded-full text-lg px-10 py-2.5 text-center mb-2 w-48"
            href={"/search"}
            rel="noreferrer"
          >
            Explore
          </a>
          <a className="" rel="noreferrer" href={"/" + user.Username}>
            <button className="flex hover:bg-gray-600 rounded-full w-48 py-2">
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
                <div className="text-white font-bold">{user.Name}</div>
                <div className="text-gray-500">{user.Username}</div>
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
            Create User
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
