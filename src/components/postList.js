import React, { useEffect, useState } from "react";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { getObjectFromStringResponse } from "../utils/regex";
import config from "../config/config";

const provider = new GnoJSONRPCProvider(config.GNO_JSONRPC_URL);

export default function PostList({
  offset,
  setPosts,
  refresh,
  user,
  userPost,
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPostsPaginated = async () => {
      try {
        const expression = !userPost
          ? "ListPostsByOffset(" + offset + ",30)"
          : `ListUserPostsByOffset("${user.Username}",` + offset + `,30)`;
        const res = await provider.evaluateExpression(
          config.GNO_POSTIT_REALM,
          expression
        );
        const response = getObjectFromStringResponse(res);
        setPosts(response);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    getPostsPaginated();
  }, [offset, user, refresh]);

  if (loading) {
    return (
      <div>
        <hr className="w-full border-l border-gray-200 opacity-25 sticky mt-4"></hr>
        <div className="flex justify-center items-center">
          <span className="mt-4 loading loading-spinner loading-md bg-sky-500"></span>
        </div>
      </div>
    );
  }

  return null;
}
