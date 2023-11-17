"use client";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import Actions from "../utils/action";

export default function Content() {
  const provider = new GnoJSONRPCProvider("http://localhost:26657");
  const getAnOutput = async () => {
    const actions = await Actions.getInstance();
    console.log(actions);
    try {
      actions
        .createUser(Math.random().toString())
        .then((response) => {
          return response;
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
  const getUserByAddress = async () => {
    const userCount = await provider.evaluateExpression(
      "gno.land/r/demo/postit",
      'GetUserByAddress("g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5")'
    );
    console.log("usercount", userCount);
  };
  return (
    <div className="flex flex-col mt-5 ml-4">
      {/* <button
        className="text-white"
        onClick={() => {
          getAnOutput();
        }}
      >
        CreateUser
      </button>
      <button
        className="text-white"
        onClick={() => {
          getUserByAddress();
        }}
      >
        GetUserByAddress
      </button> */}
      Content
    </div>
  );
}
