import { useState, useEffect } from "react";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { getObjectFromStringResponse } from "../utils/regex";
import config from "../config/config";
export default function Trending(props) {
  const [trending, setTrending] = useState([]);
  const provider = new GnoJSONRPCProvider(config.GNO_JSONRPC_URL);
  useEffect(() => {
    async function getTrending() {
      try {
        const tres = await provider.evaluateExpression(
          config.GNO_POSTIT_REALM,
          "GetTrending()"
        );
        let trends = getObjectFromStringResponse(tres);
        setTrending(trends);
      } catch (e) {
        console.error(e);
      }
    }
    getTrending();
  }, [props.refresh]);

  return (
    <div className="sticky top-5">
      <div className="font-bold text-xl">Trending</div>
      {trending.map((t, i) => {
        return (
          <div className="mt-4" key={i}>
            <div className="text-gray-500 text-sm">{i + 1 + " . Trending"}</div>
            <div
              className="font-bold hover:cursor-pointer"
              onClick={() => {
                window.location =
                  "/search?keyword=" + encodeURIComponent("#" + t.tag);
              }}
            >
              {"#" + t.tag}
            </div>
            <div className="text-gray-500 text-sm">
              {t.count + (t.count > 1 ? " posts" : " post")}
            </div>
          </div>
        );
      })}
    </div>
  );
}
