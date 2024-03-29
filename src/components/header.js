"use client";
import { useEffect, useState } from "react";
import { getFromLocalStorage } from "../utils/localstorage";
import { defaultAddressKey } from "../types/types";
import createPost from "../txs/post";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import config from "../config/config";
import { getObjectFromStringResponse } from "../utils/regex";
import { saveToLocalStorage } from "../utils/localstorage";
import Alert from "./alert";

export default function Header(props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState("#");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState("");
  const [alert, setAlert] = useState({ type: "", msg: "", show: false });

  const provider = new GnoJSONRPCProvider(config.GNO_JSONRPC_URL);

  const setAccount = async () => {
    if (window.adena) {
      let res = await window.adena.GetAccount();
      if (res) {
        setAddress(res.data?.address);
        saveToLocalStorage(defaultAddressKey, res.data?.address);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 512 * 512) {
      setErrorMessage(
        "Image size exceeds 512 x 512. Please choose a smaller file."
      );
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachment(reader.result);
      setErrorMessage("");
    };
    reader.readAsDataURL(file);
  };

  const handleInput = (e) => {
    setContent(e.target.value);
  };

  const createPostTx = async () => {
    setLoading(true);
    let addr = getFromLocalStorage(defaultAddressKey);
    try {
      createPost(addr, content, attachment).then((response) => {
        if (response.code === 0) {
          props.setRefresh(props.refresh + 1);
          setContent("");
          setAttachment("#");
          setAlert({
            type: "success",
            msg: "Post created succesfully",
            show: true,
          });
        } else {
          setAlert({
            type: "error",
            msg: "Error creating Post",
            show: true,
          });
        }
        setLoading(false);
      });
    } catch (err) {
      setAlert({
        type: "error",
        msg: "Error creating Post",
        show: true,
      });
      console.log("error in calling createPost", err);
    }
  };

  const getUser = async () => {
    try {
      const res = await provider.evaluateExpression(
        config.GNO_POSTIT_REALM,
        `GetUserByAddress("${getFromLocalStorage(
          defaultAddressKey
        ).toString()}")`
      );
      const response = getObjectFromStringResponse(res);

      setUser(response);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setAccount().then(() => {
      getUser();
    });
  }, [address]);

  return (
    <div className="flex flex-col p-4">
      <Alert alert={alert} setAlert={setAlert} />
      <div className="flex">
        <img
          className="w-10 h-10 rounded-full"
          src={
            user?.Avatar?.startsWith("data:image/")
              ? user?.Avatar
              : "./default-user-avatar.png"
          }
          alt="Rounded avatar"
        />

        <textarea
          type="type"
          value={content}
          className="ml-2 text-white bg-black p-2 border-none w-full focus:border-none outline-none resize-none"
          placeholder="What's happening?!"
          onChange={(e) => {
            handleInput(e);
          }}
        ></textarea>
      </div>

      {attachment != "#" && (
        <img
          className="max-w-60 max-h-60 w-fit h-fit rounded-2xl mt-4"
          src={attachment}
        ></img>
      )}
      {errorMessage && (
        <p className="text-red-500 text-xs mt-4">{errorMessage}</p>
      )}
      <div className="mt-1">
        <div>
          <div>
            <input
              className="text-xs"
              type="file"
              accept="image/x-png,image/gif,image/jpeg"
              onChange={(e) => {
                handleFileChange(e);
              }}
            />
          </div>
          <br />
        </div>
      </div>
      {
        <div className="ml-auto mr-4">
          <button
            type="button"
            className={
              "flex text-white bg-sky-500 hover:bg-sky-600 disabled:bg-gray-500 font-bold rounded-full text-md py-1.5 text-center mb-2 px-8 pointer-events-none opacity-50 sm:pointer-events-auto sm:opacity-100"
            }
            onClick={() => {
              createPostTx();
            }}
            disabled={loading || content.length < 1}
          >
            Post
            {loading ? (
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="ml-2 animate-spin"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
              </svg>
            ) : (
              ""
            )}
          </button>
        </div>
      }
    </div>
  );
}
