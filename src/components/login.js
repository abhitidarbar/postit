"use client";
import { useState } from "react";
import dayjs from "dayjs";
import { defaultMnemonicKey } from "../types/types";
import { saveToLocalStorage } from "../utils/localstorage";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default function Login(props) {
  const [mnemonic, setMnemonic] = useState();

  return (
    <div className="flex flex-col items-center">
      <div className="mt-48 text-5xl">Recover Local Wallet</div>
      <div className="text-sm text-gray-300">Enter your Mnemonic</div>
      <textarea
        id="message"
        rows="4"
        class="mt-5 block p-2.5 w-1/2 text text-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-black"
        placeholder="Enter Mnemonic"
        value={mnemonic}
        onChange={(e) => {
          setMnemonic(e.target.value);
        }}
      ></textarea>
      <button
        type="button"
        className={
          "mt-5 text-white font-bold rounded-full text-md px-6 py-2.5 text-center mb-2 w-48 " +
          (mnemonic?.split(" ").length !== 24
            ? "bg-gray-400"
            : "bg-sky-500 hover:bg-sky-600")
        }
        onClick={() => {
          saveToLocalStorage(defaultMnemonicKey, mnemonic);
          props.setMnemonic(mnemonic);
        }}
        disabled={mnemonic?.split(" ").length !== 24}
      >
        Create User
      </button>
    </div>
  );
}
