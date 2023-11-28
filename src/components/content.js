"use client";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useState, useEffect } from "react";
import Header from "./header";
import { getObjectFromStringResponse } from "../utils/regex";
import dayjs from "dayjs";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default function Content() {
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const provider = new GnoJSONRPCProvider("http://localhost:26657");

  useEffect(() => {
    const getPostsPaginated = async () => {
      const res = await provider.evaluateExpression(
        "gno.land/r/demo/postit",
        "ListPostsByOffset(" + offset + ",10)"
      );
      const response = getObjectFromStringResponse(res);
      setPosts(response);
    };
    getPostsPaginated();
  }, [refresh]);

  return (
    <div>
      <Header setRefresh={setRefresh} refresh={refresh} />
      <hr className="w-full border-l border-gray-200 opacity-25 sticky mt-4"></hr>
      <div className="flex flex-col">
        {posts.map((p, index = 0) => {
          return (
            <div key={index}>
              {index !== 0 ? (
                <hr className="w-full border-l border-gray-200 opacity-25 sticky mt-4"></hr>
              ) : (
                ""
              )}
              <div className="flex p-4">
                <img
                  className="w-10 h-10 rounded-full"
                  src="./default-user-avatar.png"
                  alt="Rounded avatar"
                />
                <div className="ml-3">
                  <div className="flex">
                    <div className="font-bold">{p.User.Name}</div>
                    <div className="ml-1 text-gray-400 ">@{p.Username} .</div>
                    <div className="ml-1 text-gray-400 ">
                      {dayjs(p.CreatedAt).fromNow()}
                    </div>
                  </div>
                  <div>{p.Body}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
