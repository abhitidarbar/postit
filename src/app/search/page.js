"use client";
import Sidebar from "../../components/sidebar";
import Trending from "../../components/trending";
import PostView from "../../components/posts";
import { getObjectFromStringResponse } from "../../utils/regex";
import { useState, useEffect } from "react";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useSearchParams } from "next/navigation";
import config from "../../config/config";
import { Suspense } from "react";

export default function Search() {
  const [searchParam, setSearchParam] = useState("");
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [refresh, setRefresh] = useState(0);

  const provider = new GnoJSONRPCProvider(config.GNO_JSONRPC_URL);

  const getPostsPaginated = async () => {
    if (keyword.length > 0 || searchParam.length > 0) {
      const res = await provider
        .evaluateExpression(
          config.GNO_POSTIT_REALM,
          `ListKeywordPostsByOffset("${
            keyword.length > 0 ? keyword : searchParam
          }",` +
            offset +
            `,10)`
        )
        .then((res) => {
          const response = getObjectFromStringResponse(res);
          setPosts(response);
          if (keyword.length > 0) setKeyword("");
        });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let key = params.get("keyword");
    if (key === null || key === undefined || key === "") return;
    setKeyword(key);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      getPostsPaginated();
    }
  }, [keyword, refresh]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex w-screen bg-black">
        <div className="w-1/6 p-4"></div>
        <div className="w-1/4 p-4">
          <Sidebar />
        </div>
        <hr className="h-screen border-l border-gray-200 opacity-25 sticky top-0"></hr>
        <div className="w-1/2 py-2">
          <div className="px-4">
            <label
              value={searchParam}
              className="input input-bordered rounded-full flex items-center gap-2"
              onChange={(e) => {
                setSearchParam(e.target.value);
              }}
            >
              <svg
                fill="#808080"
                height="17px"
                width="17px"
                version="1.1"
                id="Capa_1"
                viewBox="0 0 488.4 488.4"
                xmlSpace="preserve"
              >
                <g>
                  <g>
                    <path
                      d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6
			s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2
			S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7
			S381.9,104.65,381.9,203.25z"
                    />
                  </g>
                </g>
              </svg>
              <input type="text" className="grow" placeholder="Search" />
              <div
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => {
                  getPostsPaginated();
                }}
              >
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  className=""
                >
                  <path
                    d="M6 12H18M18 12L13 7M18 12L13 17"
                    stroke="#0ea5e9"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </label>
          </div>

          <div className="flex flex-col">
            {posts.map((p, index = 0) => {
              return <PostView p={p} key={index} setRefresh={setRefresh} />;
            })}
          </div>
        </div>

        <hr className="h-screen border-l border-gray-200 opacity-25 sticky top-0"></hr>
        <div className="w-1/4 p-4">
          <Trending />
        </div>
        <div className="w-1/6 p-4"></div>
      </div>
    </Suspense>
  );
}
