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

export async function updateAvatar(addr, avatar) {
  const message = generateMessage(addr, "SetAvatar", [avatar]);
  const res = await adena.DoContract({
    messages: [message],
    gasFee: Config.GAS_FEE,
    gasWanted: Config.GAS_WANTED,
    memo: "setAvatar",
  });
  return res;
}
