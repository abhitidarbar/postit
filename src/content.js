import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
// var { Actions } = require("../utils/action").default;
import Actions from "./utils/action";

export default function Content() {
  const provider = new GnoJSONRPCProvider("http://localhost:26657");
  const getAnOutput = async () => {
    console.log("heloooooo", Actions);
    const actions = Actions.hello();
    // const response = await provider.evaluateExpression(
    //   "gno.land/r/demo/postit",
    //   'CreateUser("000000")'
    // );
    // try {
    //   actions.createUser("0000").then((response) => {
    //     console.log(response);
    //   });
    // } catch (err) {
    //   console.log("error in calling startGame", err);
    // }
  };
  var response = getAnOutput();
  return <div className="text-white">Content</div>;
}
