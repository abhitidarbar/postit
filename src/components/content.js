"use client";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useState, useEffect } from "react";
import Header from "./header";
import { getObjectFromStringResponse } from "../utils/regex";
import dayjs from "dayjs";
import PostView from "./posts";
import config from "../config/config";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default function Content(props) {
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const provider = new GnoJSONRPCProvider(config.GNO_JSONRPC_URL);

  useEffect(() => {
    const getPostsPaginated = async () => {
      try {
        const res = await provider.evaluateExpression(
          config.GNO_POSTIT_REALM,
          "ListPostsByOffset(" + offset + ",30)"
        );
        const response = getObjectFromStringResponse(res);
        setPosts(response);

        getPostsPaginated();
      } catch (e) {
        console.error(e);
      }
    };
  }, [props.refresh]);

  return (
    <div>
      <Header setRefresh={props.setRefresh} refresh={props.refresh} />
      <hr className="w-full border-l border-gray-200 opacity-25 sticky mt-4"></hr>
      <div className="flex flex-col">
        {posts.map((p, index = 0) => {
          return <PostView p={p} key={index} setRefresh={props.setRefresh} />;
        })}
        <div className="h-20"></div>
      </div>
    </div>
  );
}
