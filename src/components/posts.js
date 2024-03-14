import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
import { likePost } from "../txs/post";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getFromLocalStorage } from "../utils/localstorage";
import { defaultAddressKey } from "../types/types";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { getObjectFromStringResponse } from "../utils/regex";

export default function PostView(props) {
  const provider = new GnoJSONRPCProvider("http://localhost:26657");
  const [offset, setOffset] = useState(0);
  const [likedBy, setLikedBy] = useState([]);
  const [user, setUser] = useState({});

  const getLikedBy = async (id) => {
    const res = await provider.evaluateExpression(
      "gno.land/r/demo/postit",
      `ListPostLikedBy(` + id + `,` + offset + `,10)`
    );
    const response = getObjectFromStringResponse(res);
    console.log(response);
    setLikedBy(response);
  };

  const getUser = async () => {
    const address = getFromLocalStorage(defaultAddressKey);
    try {
      const res = await provider.evaluateExpression(
        "gno.land/r/demo/postit",
        `GetUserByAddress("${address.toString()}")`
      );
      const response = getObjectFromStringResponse(res);
      setUser(response);
    } catch (e) {
      console.error(e);
    }
  };

  const likePostTx = async (id) => {
    console.log(id);
    try {
      likePost(user.Address, id).then((response) => {
        console.log(response);
        props.setRefresh(props.refresh + 1);
      });
    } catch (err) {
      console.log("error in calling likePost", err);
    }
  };

  function alreadyLiked(likedBy) {
    return likedBy.some((u) => u === user.Username);
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div key={props.index}>
      {props.index !== 0 ? (
        <hr className="w-full border-l border-gray-200 opacity-25 sticky mt-4"></hr>
      ) : (
        ""
      )}
      <div className="flex p-4">
        <img
          className="w-10 h-10 rounded-full"
          src={
            props.p.User.Avatar?.startsWith("data:image/")
              ? props.p.User.Avatar
              : "./default-user-avatar.png"
          }
          alt="Rounded avatar"
        />
        <div className="ml-3">
          <div className="flex">
            <a className="font-bold">{props.p.User.Name}</a>
            <div className="ml-1 text-gray-400 ">@{props.p.Username} .</div>
            <div className="ml-1 text-gray-400 ">
              {dayjs(props.p.CreatedAt).fromNow()}
            </div>
          </div>
          <div>{props.p.Body}</div>
          <dialog id={props.p.Id} className="modal">
            <div className="modal-box p-0">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <img
                className="rounded-2xl w-full h-full"
                src={props.p.Attachment}
              ></img>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
          {props.p.Attachment.startsWith("data:image/") && (
            <button
              className=""
              onClick={() => document.getElementById(props.p.Id).showModal()}
            >
              <img
                className="rounded-2xl max-w-60 max-h-60 mt-1"
                src={props.p.Attachment}
              ></img>
            </button>
          )}
        </div>
      </div>
      {console.log(alreadyLiked(props.p.LikedBy))}
      <div className="flex mr-12">
        <svg
          width="25px"
          height="25px"
          viewBox="0 0 24 24"
          fill={!alreadyLiked(props.p.LikedBy) ? "none" : "#db2777"}
          xmlns="http://www.w3.org/2000/svg"
          className="ml-auto mr-1 hover:cursor-pointer"
          onClick={() => {
            likePostTx(props.p.Id);
          }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
            stroke={!alreadyLiked(props.p.LikedBy) ? "#808080" : "#db2777"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          className={
            "text-sm mt-0.5 hover:cursor-pointer hover:underline " +
            (!alreadyLiked(props.p.LikedBy) ? "text-gray" : "text-pink-600")
          }
          onClick={() => {
            getLikedBy(props.p.Id);
            document.getElementById("my_modal_2").showModal();
          }}
        >
          {props.p.LikedBy.length}
        </div>

        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <div className="font-bold mb-4">Liked by</div>
            {likedBy.length < 1 && <div className="italic text-sm">None</div>}

            {likedBy.map((u, index = 0) => {
              return (
                <Link
                  className="flex mb-4 hover:cursor-pointer"
                  key={index}
                  href={"/" + u.Username}
                >
                  <img
                    className="w-11 h-11 rounded-full mr-2"
                    src={
                      u.Avatar?.startsWith("data:image/")
                        ? u.Avatar
                        : "./default-user-avatar.png"
                    }
                    alt="Rounded avatar"
                  />
                  <div className="">
                    <a className="font-bold text-sm">{u.Name}</a>
                    <div className="text-gray-400 text-sm">@{u.Username}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
}
