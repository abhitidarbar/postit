"use client";
import Sidebar from "../../components/sidebar";
import Trending from "../../components/trending";
import { useState, useEffect } from "react";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { getObjectFromStringResponse } from "../../utils/regex";
import dayjs from "dayjs";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
export default function Profile() {
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const provider = new GnoJSONRPCProvider("http://localhost:26657");
  useEffect(() => {
    const getUser = async () => {
      const user = await provider.evaluateExpression(
        "gno.land/r/demo/postit",
        `GetUserByAddress("g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf")`
      );
      console.log("user", user);
    };
    getUser();
  }, []);
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
    <div className="flex w-screen bg-black">
      <div className="w-1/4 p-4">
        <Sidebar />
      </div>
      <hr className="h-screen border-l border-gray-200 opacity-25 sticky top-0"></hr>
      <div className="w-1/2 py-1">
        <div className="flex">
          <a
            href="/"
            rel="noreferrer"
            className="flex ml-4 hover:bg-gray-800 rounded-full items-center justify-center px-4"
          >
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              className=""
            >
              <path
                fill="#ffffff"
                d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
              />
              <path
                fill="#ffffff"
                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
              />
            </svg>
          </a>
          <div className="ml-8">
            <div className="text-lg font-bold">Abhiti Darbar</div>
            <div className="font-bold">9 posts</div>
          </div>
        </div>
        <img
          className="w-24 h-24 rounded-full ml-4 mt-10"
          src="./favicon.ico"
          alt="Rounded avatar"
        />
        <div className="text-lg mt-4 ml-4 font-bold">Abhiti Darbar</div>
        <div className="text-gray-500 ml-4">@abhitidarbar</div>
        <div className=" ml-4 mt-4 text-sm">Bio bio bio bio bio</div>
        <div className="ml-4 flex my-2">
          <svg
            fill="#6b7280"
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19,4H17V3a1,1,0,0,0-2,0V4H9V3A1,1,0,0,0,7,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V12H20Zm0-9H4V7A1,1,0,0,1,5,6H7V7A1,1,0,0,0,9,7V6h6V7a1,1,0,0,0,2,0V6h2a1,1,0,0,1,1,1Z" />
          </svg>
          <div className="text-gray-500 ml-2">Joined May 2016</div>
        </div>
        <div className="ml-4 flex text-sm">
          <div className="flex">
            <div className="font-bold">22 </div>
            <div className="text-gray-500 ml-1">following</div>
          </div>
          <div className="flex ml-6">
            <div className="font-bold">15 </div>
            <div className="text-gray-500 ml-1">followers</div>
          </div>
        </div>
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
                    src="./favicon.ico"
                    alt="Rounded avatar"
                  />
                  <div className="ml-3">
                    <div className="flex">
                      <div className="font-bold">{"Name"}</div>
                      <div className="ml-1 text-gray-400 ">@{p.Username} .</div>
                      <div className="ml-1 text-gray-400 ">
                        {dayjs(p.Timestamp).fromNow()}
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
      <hr className="h-screen border-l border-gray-200 opacity-25 sticky top-0"></hr>
      <div className="w-1/4 p-4">
        <Trending />
      </div>
    </div>
  );
}
