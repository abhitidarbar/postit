import { useState, useEffect } from "react";
import Actions from "../utils/action";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { getObjectFromStringResponse } from "../utils/regex";
import config from "../utils/config";
export default function Sidebar() {
  const [user, setUser] = useState({});
  const provider = new GnoJSONRPCProvider("http://localhost:26657");
  const createUser = async () => {
    const actions = await Actions.getInstance();
    try {
      actions
        .createUser("foobar", "Foo Barney")
        .then((response) => {
          console.log(response);
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
  useEffect(() => {
    const getUser = async () => {
      const res = await provider.evaluateExpression(
        "gno.land/r/demo/postit",
        `GetUserByAddress("g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5")`
      );
      const response = getObjectFromStringResponse(res);
      setUser(response);
    };
    getUser();
  }, []);
  return (
    <div className="flex flex-col sticky top-5 items-center">
      <span className="flex flex-row justify-center mb-4 w-48">
        <div className="font-bold">POST</div>
        <div className="font-bold">.</div>
        <div className="text-sky-500 font-bold">it</div>
      </span>
      <a
        className="text-white hover:bg-gray-800 font-bold rounded-full text-lg px-10 py-2.5 text-center mb-2 w-48"
        href="/"
        rel="noreferrer"
      >
        Home
      </a>
      <a
        className="text-white hover:bg-gray-800 font-bold rounded-full text-lg px-10 py-2.5 text-center mb-2 w-48"
        href="/profile"
        rel="noreferrer"
      >
        Profile
      </a>
      <a
        type="button"
        className="text-white bg-sky-500 hover:bg-sky-600 font-bold rounded-full text-md px-6 py-2.5 text-center mb-2 w-48"
      >
        Post
      </a>
      {user?.Address?.length > 0 ? (
        <a className="" rel="noreferrer" href="/profile">
          <button className="flex hover:bg-gray-600 rounded-full w-48 py-2">
            <img
              className="w-10 h-10 rounded-full mt-1 ml-3"
              src="./default-user-avatar.png"
              alt="Rounded avatar"
            />
            <div className="ml-3">
              <div className="text-white font-bold">{user.Name}</div>
              <div className="text-gray-500">{user.Username}</div>
            </div>
          </button>
        </a>
      ) : (
        <button
          type="button"
          className="text-white bg-sky-500 hover:bg-sky-600 font-bold rounded-full text-md px-6 py-2.5 text-center mb-2 w-48"
          onClick={() => {
            createUser();
          }}
        >
          Create User
        </button>
      )}
    </div>
  );
}
