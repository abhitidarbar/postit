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
export async function likePost(addr, id) {
  const message = generateMessage(addr, "LikePost", [id.toString()]);
  console.log(message);
  const res = await adena.DoContract({
    messages: [message],
    gasFee: Config.GAS_FEE,
    gasWanted: Config.GAS_WANTED,
    memo: "likePost",
  });
  return res;
}
