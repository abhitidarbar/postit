import { useState, useEffect } from "react";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { getObjectFromStringResponse } from "../utils/regex";
import Link from "next/link";
export default function Trending(props) {
  const [trending, setTrending] = useState([]);
  const provider = new GnoJSONRPCProvider("http://localhost:26657");
  useEffect(() => {
    async function getTrending() {
      const tres = await provider.evaluateExpression(
        "gno.land/r/demo/postit",
        "GetTrending()"
      );
      let trends = getObjectFromStringResponse(tres);
      setTrending(trends);
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
              className="font-bold"
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
