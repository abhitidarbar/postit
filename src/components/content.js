import React, { useState } from "react";
import Header from "./header";
import dayjs from "dayjs";
import PostView from "./posts";
import { Suspense } from "react";
import PostList from "./postList";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default function Content(props) {
  const [posts, setPosts] = useState([]);

  return (
    <div>
      <Header setRefresh={props.setRefresh} refresh={props.refresh} />
      <Suspense>
        <PostList offset={0} setPosts={setPosts} refresh={props.refresh} />
        <div className="flex flex-col">
          {posts.map((p, index) => (
            <PostView p={p} key={index} setRefresh={props.setRefresh} />
          ))}
          <div className="h-20"></div>
        </div>
      </Suspense>
    </div>
  );
}
