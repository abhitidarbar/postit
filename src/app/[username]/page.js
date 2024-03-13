"use client";
import Sidebar from "../../components/sidebar";
import Trending from "../../components/trending";
import { useState, useEffect } from "react";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { getObjectFromStringResponse } from "../../utils/regex";
import dayjs from "dayjs";
import { getFromLocalStorage } from "../../utils/localstorage";
import { defaultAddressKey } from "../../types/types";
import { updateAvatar, updateBio } from "../../txs/user";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default function Profile({ params }) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [offset, setOffset] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [profilePicture, setProfilePicture] = useState("#");
  const [userBio, setUserBio] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const provider = new GnoJSONRPCProvider("http://localhost:26657");

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsHovered(false);
    }, 500);
  };

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (scrollY + windowHeight >= documentHeight - 100) {
      setOffset(offset + 10);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offset]);

  const getUser = async () => {
    let u = params.username;
    setUsername(u);
    try {
      const res = await provider
        ?.evaluateExpression(
          "gno.land/r/demo/postit",
          `GetUserByUsername("${username.toString()}")`
        )
        .then((res) => {
          const response = getObjectFromStringResponse(res);
          setUser(response);
          setProfilePicture(response.Avatar);
        });
    } catch (e) {
      console.error(e);
    }
  };

  const getPostsPaginated = async () => {
    console.log(offset);
    const res = await provider?.evaluateExpression(
      "gno.land/r/demo/postit",
      `ListUserPostsByOffset("${user.Username}",` + offset + `,10)`
    );
    if (res) {
      const response = getObjectFromStringResponse(res);
      setPosts([...posts, ...response]);
    }
  };

  useEffect(() => {
    getUser();
  }, [username]);

  useEffect(() => {
    getPostsPaginated();
  }, [refresh, user, offset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setErrorMessage(
        "Image size exceeds 1024 x 1024. Please choose a smaller file."
      );
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result);
      setErrorMessage("");
    };
    reader.readAsDataURL(file);
  };
  const updateAvatarTx = async () => {
    setLoading(true);
    const address = getFromLocalStorage(defaultAddressKey);

    try {
      updateAvatar(address, profilePicture).then((response) => {
        {
          response.code === 0
            ? window.location.reload()
            : console.error(response);
        }
        setLoading(false);
      });
    } catch (err) {
      console.log("error in calling updateAvatar", err);
    }
  };

  const updateBioTx = async () => {
    setLoading(true);
    const address = getFromLocalStorage(defaultAddressKey);

    try {
      updateBio(address, userBio).then((response) => {
        {
          response.code === 0
            ? window.location.reload()
            : console.error(response);
        }
        setLoading(false);
      });
    } catch (err) {
      console.log("error in calling updateBio", err);
    }
  };

  return (
    <div className="flex w-screen bg-black">
      <div className="w-1/6 p-4"></div>
      <div className="w-1/4 p-4">
        <Sidebar />
      </div>
      <hr className="h-screen border-l border-gray-200 opacity-25 sticky top-0"></hr>
      <div className="w-1/2 py-1">
        <div className="flex">
          <div
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
          </div>
          <div className="mt-1 ml-8">
            <div className="text-lg font-bold">{user.Name}</div>
            <div className="text-gray-400 text-sm font-bold">
              {user.PostCount + " posts"}{" "}
            </div>
          </div>
        </div>
        <div className="flex items-center ml-4 mt-10">
          <div
            className="relative flex flex-col items-center justify-center"
            onClick={() =>
              document.getElementById("profile_picture").showModal()
            }
          >
            {true && (
              <span
                className={
                  "absolute bg-transparent border-transparent " +
                  (isHovered ? "visible" : "invisible")
                }
              >
                <svg
                  fill="#000000"
                  height="50px"
                  width="50px"
                  version="1.1"
                  id="Capa_1"
                  viewBox="0 0 384.97 384.97"
                  xmlSpace="preserve"
                >
                  <g>
                    <g id="Upload">
                      <path
                        d="M372.939,264.641c-6.641,0-12.03,5.39-12.03,12.03v84.212H24.061v-84.212c0-6.641-5.39-12.03-12.03-12.03
			S0,270.031,0,276.671v96.242c0,6.641,5.39,12.03,12.03,12.03h360.909c6.641,0,12.03-5.39,12.03-12.03v-96.242
			C384.97,270.019,379.58,264.641,372.939,264.641z"
                      />
                      <path
                        d="M117.067,103.507l63.46-62.558v235.71c0,6.641,5.438,12.03,12.151,12.03c6.713,0,12.151-5.39,12.151-12.03V40.95
			l63.46,62.558c4.74,4.704,12.439,4.704,17.179,0c4.74-4.704,4.752-12.319,0-17.011l-84.2-82.997
			c-4.692-4.656-12.584-4.608-17.191,0L99.888,86.496c-4.752,4.704-4.74,12.319,0,17.011
			C104.628,108.211,112.327,108.211,117.067,103.507z"
                      />
                    </g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                  </g>
                </svg>
              </span>
            )}
            <img
              className="w-24 h-24 rounded-full"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              src={
                user.Avatar?.startsWith("data:image/")
                  ? user.Avatar
                  : "./default-user-avatar.png"
              }
              alt="Rounded avatar"
            />
          </div>
          {true && (
            <button
              className="mt-12 ml-auto mr-4 btn btn-sm h-9 w-28 rounded-full bg-black hover:bg-grey-900 text-white border-gray-500"
              onClick={() =>
                document.getElementById("edit_profile").showModal()
              }
            >
              Edit Profile
            </button>
          )}
        </div>
        <dialog
          id="edit_profile"
          className="modal modal-bottom sm:modal-middle"
        >
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
          <div className="modal-box">
            <div>
              <div className="flex absolute left-2 top-3">
                <form method="dialog ">
                  <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                </form>
                <div className="ml-6 font-bold text-lg">Edit profile</div>
              </div>
              <button
                type="button"
                className={
                  "absolute top-3 right-2 flex text-black bg-white hover:bg-white-900 disabled:bg-gray-500 font-bold rounded-full text-md py-1.5 text-center px-5 text-sm"
                }
                onClick={() => {
                  updateBioTx();
                }}
                disabled={loading}
              >
                Save
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
            <label className="input input-bordered flex flex-col py-2 mt-10 input-lg">
              <div className="text-gray-400 text-xs">Bio</div>
              <input
                value={userBio}
                type="text"
                className="grow text-white"
                placeholder="Bio"
                onChange={(e) => {
                  setUserBio(e.target.value);
                }}
              />
            </label>
          </div>
        </dialog>
        <dialog id="profile_picture" className="modal">
          <div className="modal-box bg-grey flex flex-col items-center">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>

            <img
              className="w-60 h-60 rounded-full mt-4 mb-5"
              src={
                profilePicture?.startsWith("data:image/")
                  ? profilePicture
                  : "./default-user-avatar.png"
              }
            ></img>

            {errorMessage && (
              <p className="text-red-500 text-xs mt-4">{errorMessage}</p>
            )}

            <input
              className="text-xs mt-1 mb-6 w-1/3 ml-2"
              type="file"
              accept="image/x-png,image/gif,image/jpeg"
              onChange={(e) => {
                handleFileChange(e);
              }}
            />

            <div className="">
              <button
                type="button"
                className={
                  "flex text-white bg-sky-500 hover:bg-sky-600 disabled:bg-gray-500 font-bold rounded-full text-md py-1.5 text-center mb-2 px-8"
                }
                onClick={() => {
                  updateAvatarTx();
                }}
                disabled={loading}
              >
                Update Avatar
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
          </div>
        </dialog>

        <div className="text-lg mt-4 ml-4 font-bold">{user.Name}</div>
        <div className="text-gray-500 ml-4">{"@" + user.Username}</div>
        <div className="ml-4 mt-3 mb-4 text-sm {user.Username === '' ? italic : ''}">
          {user.Bio === "" ? "No bio set" : user.Bio}
        </div>
        <div className="ml-4 flex my-2">
          <svg
            fill="#6b7280"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1" />
          </svg>
          <div className="text-gray-500 ml-1 text-sm">{user.Address}</div>{" "}
        </div>
        <div className="ml-4 flex my-2">
          <svg
            fill="#6b7280"
            width="18px"
            height="18px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19,4H17V3a1,1,0,0,0-2,0V4H9V3A1,1,0,0,0,7,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V12H20Zm0-9H4V7A1,1,0,0,1,5,6H7V7A1,1,0,0,0,9,7V6h6V7a1,1,0,0,0,2,0V6h2a1,1,0,0,1,1,1Z" />
          </svg>
          <div className="text-gray-500 ml-2 text-sm">
            Joined {dayjs(user.CreatedAt).format("MMM YYYY")}
          </div>{" "}
        </div>
        <div className="ml-4 flex text-sm">
          <div className="flex">
            <div className="font-bold">0 </div>
            <div className="text-gray-500 ml-1">following</div>
          </div>
          <div className="flex ml-6">
            <div className="font-bold">0 </div>
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
                    src={
                      user.Avatar?.startsWith("data:image/")
                        ? user.Avatar
                        : "./default-user-avatar.png"
                    }
                    alt="Rounded avatar"
                  />
                  <div className="ml-3">
                    <div className="flex">
                      <div className="font-bold">{p.User.Name}</div>
                      <div className="ml-1 text-gray-400 ">@{p.Username} .</div>
                      <div className="ml-1 text-gray-400 ">
                        {dayjs(p.Timestamp).fromNow()}
                      </div>
                    </div>
                    <div>{p.Body}</div>
                    <dialog id={p.Id} className="modal">
                      <div className="modal-box p-0">
                        <form method="dialog">
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                          </button>
                        </form>
                        <img
                          className="rounded-2xl w-full h-full"
                          src={p.Attachment}
                        ></img>
                      </div>
                      <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                      </form>
                    </dialog>
                    {p.Attachment.startsWith("data:image/") && (
                      <button
                        className=""
                        onClick={() =>
                          document.getElementById(p.Id).showModal()
                        }
                      >
                        <img
                          className="rounded-2xl max-w-60 max-h-60 mt-1"
                          src={p.Attachment}
                        ></img>
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50 50"
                    width="21px"
                    height="21px"
                    fill="#808080"
                    className="w-1/4"
                  >
                    <path d="M 25 4.0625 C 12.414063 4.0625 2.0625 12.925781 2.0625 24 C 2.0625 30.425781 5.625 36.09375 11 39.71875 C 10.992188 39.933594 11 40.265625 10.71875 41.3125 C 10.371094 42.605469 9.683594 44.4375 8.25 46.46875 L 7.21875 47.90625 L 9 47.9375 C 15.175781 47.964844 18.753906 43.90625 19.3125 43.25 C 21.136719 43.65625 23.035156 43.9375 25 43.9375 C 37.582031 43.9375 47.9375 35.074219 47.9375 24 C 47.9375 12.925781 37.582031 4.0625 25 4.0625 Z M 25 5.9375 C 36.714844 5.9375 46.0625 14.089844 46.0625 24 C 46.0625 33.910156 36.714844 42.0625 25 42.0625 C 22.996094 42.0625 21.050781 41.820313 19.21875 41.375 L 18.65625 41.25 L 18.28125 41.71875 C 18.28125 41.71875 15.390625 44.976563 10.78125 45.75 C 11.613281 44.257813 12.246094 42.871094 12.53125 41.8125 C 12.929688 40.332031 12.9375 39.3125 12.9375 39.3125 L 12.9375 38.8125 L 12.5 38.53125 C 7.273438 35.21875 3.9375 29.941406 3.9375 24 C 3.9375 14.089844 13.28125 5.9375 25 5.9375 Z" />
                  </svg>
                  <svg
                    fill="#808080"
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
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                      stroke="#808080"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                      stroke="#808080"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 8L12 4M12 4L8 8M12 4L12 16"
                      stroke="#808080"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
          <div className="h-20"></div>
        </div>
      </div>
      <hr className="h-screen border-l border-gray-200 opacity-25 sticky top-0"></hr>
      <div className="w-1/4 p-4">
        <Trending />
      </div>
      <div className="w-1/6 p-4"></div>
    </div>
  );
}
