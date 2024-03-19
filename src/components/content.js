import React, { useState, useEffect } from "react";
import Header from "./header";
import dayjs from "dayjs";
import PostView from "./posts";
import { Suspense } from "react";
import PostList from "./postList";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import config from "../config/config";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default function Content(props) {
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [postCount, setPostCount] = useState(0);

  const provider = new GnoJSONRPCProvider(config.GNO_JSONRPC_URL);
  const getPostCount = async () => {
    try {
      const res = await provider.evaluateExpression(
        config.GNO_POSTIT_REALM,
        "GetPostCount()"
      );
      let count = res.substring(1, res.length - 1).split(" ")[0];
      setPostCount(count);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getPostCount();
  }, []);

  return (
    <div>
      <Header setRefresh={props.setRefresh} refresh={props.refresh} />
      <Suspense>
        <div className="flex flex-col">
          {posts.map((p, index) => (
            <PostView p={p} key={index} setRefresh={props.setRefresh} />
          ))}
          <div className="h-20"></div>
        </div>
        <PostList offset={offset} setPosts={setPosts} refresh={props.refresh} />
        <div className="flex flex-col items-center mb-12">
          {!(offset + 10 > postCount) && (
            <div
              className="btn btn-outline border-sky-500 text-sky-500 w-60"
              onClick={() => {
                setOffset((offset) => offset + 10);
              }}
            >
              Load More
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
}
