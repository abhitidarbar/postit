import Config from "../config/config";
import generateMessage from "./msg";

export default async function createPost(addr, body, attachment) {
  const message = generateMessage(addr, "CreatePost", [body, attachment]);
  const res = await adena.DoContract({
    messages: [message],
    gasFee: Config.GAS_FEE,
    gasWanted: Config.GAS_WANTED,
    memo: "createPost",
  });
  return res;
}
