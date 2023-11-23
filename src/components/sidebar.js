import Actions from "../utils/action";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";

export default function Sidebar() {
  const provider = new GnoJSONRPCProvider("http://localhost:26657");
  const createUser = async () => {
    const actions = await Actions.getInstance();
    try {
      actions
        .createUser("username", "name")
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
  return (
    <div className="flex flex-col sticky top-5 items-center">
      <span className="flex flex-row justify-center mb-4 w-48">
        <div className="font-bold">POST</div>
        <div className="font-bold">.</div>
        <div className="text-sky-500 font-bold">it</div>
      </span>
      <button
        type="button"
        className="text-white hover:bg-gray-800 font-bold rounded-full text-lg px-10 py-2.5 text-center mb-2 w-48"
      >
        Home
      </button>
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

      <button
        type="button"
        className="text-white bg-sky-500 hover:bg-sky-600 font-bold rounded-full text-md px-6 py-2.5 text-center mb-2 w-48"
        onClick={() => {
          createUser();
        }}
      >
        Create User
      </button>
    </div>
  );
}
