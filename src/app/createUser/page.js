"use client";
import { useState } from "react";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import Link from "next/link";
import createUser from "../../txs/user";
import { getFromLocalStorage } from "../../utils/localstorage";
import { defaultAddressKey } from "../../types/types";

export default function Login(props) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [userCreated, setUserCreated] = useState(false);

  const provider = new GnoJSONRPCProvider("http://localhost:26657");
  const createUserTx = async () => {
    const address = getFromLocalStorage(defaultAddressKey);
    console.log(address);
    try {
      createUser(address, username, name)
        .then((response) => {
          if (response.code === 0) {
            setUserCreated(true);
          }
        })
        .finally(async () => {
          const userCount = await provider.evaluateExpression(
            "gno.land/r/demo/postit",
            "GetUserCount()"
          );
          console.log("usercount", userCount);
        });
    } catch (err) {
      console.log("error in calling createUser", err);
    }
  };

  return userCreated ? (
    <div className="flex flex-col items-center h-screen">
      <div className="mt-48 text-5xl">Yay!</div>
      <div className="text-base text-gray-300 mt-5">
        User Created Succesfully
      </div>
      <Link
        href={"/"}
        className={
          "mt-5 text-white font-bold rounded-full text-md px-6 py-2 text-center mb-2 w-48 uppercase bg-sky-500 hover:bg-sky-600"
        }
      >
        GO TO HOME
      </Link>
    </div>
  ) : (
    <div className="flex flex-col items-center">
      <div className="mt-48 text-5xl">Create User</div>

      <div className="flex mt-14">
        <div className="text-base text-gray-300 mr-4">Enter your Name</div>
        <input
          className="rounded text-black text-center"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>

      <div className="flex mt-4">
        <div className="text-base text-gray-300 mr-4">Enter your username</div>
        <input
          className="rounded text-black text-center"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </div>

      <button
        type="button"
        className={
          "mt-5 text-white font-bold rounded-full text-md px-6 py-2 text-center mb-2 w-48 " +
          (name.length === 0 || username.length === 0
            ? "bg-gray-400"
            : "bg-sky-500 hover:bg-sky-600")
        }
        onClick={() => {
          createUserTx();
        }}
        disabled={name.length === 0 || username.length === 0}
      >
        Create User
      </button>
    </div>
  );
}
