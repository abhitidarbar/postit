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
                    <a className="font-bold">{p.User.Name}</a>
                    <div className="ml-1 text-gray-400 ">@{p.Username} .</div>
                    <div className="ml-1 text-gray-400 ">
                      {dayjs(p.CreatedAt).fromNow()}
                    </div>
                  </div>
                  <div>{p.Body}</div>
                </div>
              </div>
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width="25px"
                  height="25px"
                  fill="#ffffff"
                  className="w-1/4"
                >
                  <path d="M 25 4.0625 C 12.414063 4.0625 2.0625 12.925781 2.0625 24 C 2.0625 30.425781 5.625 36.09375 11 39.71875 C 10.992188 39.933594 11 40.265625 10.71875 41.3125 C 10.371094 42.605469 9.683594 44.4375 8.25 46.46875 L 7.21875 47.90625 L 9 47.9375 C 15.175781 47.964844 18.753906 43.90625 19.3125 43.25 C 21.136719 43.65625 23.035156 43.9375 25 43.9375 C 37.582031 43.9375 47.9375 35.074219 47.9375 24 C 47.9375 12.925781 37.582031 4.0625 25 4.0625 Z M 25 5.9375 C 36.714844 5.9375 46.0625 14.089844 46.0625 24 C 46.0625 33.910156 36.714844 42.0625 25 42.0625 C 22.996094 42.0625 21.050781 41.820313 19.21875 41.375 L 18.65625 41.25 L 18.28125 41.71875 C 18.28125 41.71875 15.390625 44.976563 10.78125 45.75 C 11.613281 44.257813 12.246094 42.871094 12.53125 41.8125 C 12.929688 40.332031 12.9375 39.3125 12.9375 39.3125 L 12.9375 38.8125 L 12.5 38.53125 C 7.273438 35.21875 3.9375 29.941406 3.9375 24 C 3.9375 14.089844 13.28125 5.9375 25 5.9375 Z" />
                </svg>
                <svg
                  fill="#ffffff"
                  width="25px"
                  height="25px"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-1/4"
                >
                  <path d="M19 7a1 1 0 0 0-1-1h-8v2h7v5h-3l3.969 5L22 13h-3V7zM5 17a1 1 0 0 0 1 1h8v-2H7v-5h3L6 6l-4 5h3v6z" />
                </svg>
                <svg
                  width="25px"
                  height="25px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-1/4"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                    stroke="#ffffff"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  width="25px"
                  height="25px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-1/4"
                >
                  <path
                    d="M20 13L20 18C20 19.1046 19.1046 20 18 20L6 20C4.89543 20 4 19.1046 4 18L4 13"
                    stroke="#ffffff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16 8L12 4M12 4L8 8M12 4L12 16"
                    stroke="#ffffff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
