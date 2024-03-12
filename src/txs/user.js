import Config from "../config/config";
import generateMessage from "./msg";

export default async function createUser(addr, username, name) {
  const message = generateMessage(addr, "CreateUser", [username, name]);
  const res = await adena.DoContract({
    messages: [message],
    gasFee: Config.GAS_FEE,
    gasWanted: Config.GAS_WANTED,
    memo: "createUser",
  });
  return res;
}
