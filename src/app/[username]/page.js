"use client";
import Sidebar from "../../components/sidebar";
import Trending from "../../components/trending";
import { useState, useEffect, Suspense } from "react";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { getObjectFromStringResponse } from "../../utils/regex";
import dayjs from "dayjs";
import { getFromLocalStorage } from "../../utils/localstorage";
import { defaultAddressKey } from "../../types/types";
import { updateAvatar, updateBio } from "../../txs/user";
import config from "../../config/config";
import Link from "next/link";
import PostView from "../../components/posts";
import PostList from "../../components/postList";
import Loading from "../../components/loading";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default function Profile({ params }) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [profilePicture, setProfilePicture] = useState("#");
  const [userBio, setUserBio] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [load, setLoad] = useState(null);

  const [offset, setOffset] = useState(0);

  const provider = new GnoJSONRPCProvider(config.GNO_JSONRPC_URL);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsHovered(false);
    }, 100);
  };

  const getUser = async () => {
    try {
      const res = await provider
        ?.evaluateExpression(
          config.GNO_POSTIT_REALM,
          `GetUserByUsername("${params.username.toString()}")`
        )
        .then((res) => {
          const response = getObjectFromStringResponse(res);
          if (response.Username.length > 0) {
            setUser(response);
            setLoad(true);
            setProfilePicture(response.Avatar);
          } else {
            setLoad(false);
          }
        });
    } catch (e) {
      console.error(e);
      setLoad(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

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
      console.error("error in calling updateAvatar", err);
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
      console.error("error in calling updateBio", err);
    }
  };

  if (load == null) return <Loading />;

  if (load)
    return (
      <div className="flex w-screen bg-black">
        <div className="sm:hidden text-xs absolute top-0 bg-sky-500 w-full flex items-center justify-center">
          <div> Mobile devices may not fully support all functionalities</div>
        </div>
        <div className="w-1/6 p-4"></div>
        <div className="w-1/4 p-4 hidden sm:inline">
          <Sidebar />
        </div>

        <hr className="h-screen border-l border-gray-200 opacity-25 sticky top-0 hidden sm:inline"></hr>
        <div className="w-full sm:w-1/2 py-1 mt-4 sm:mt-0">
          <div className="flex">
            <a
              href="/"
              rel="noreferrer"
              className="flex sm:ml-4 hover:bg-gray-800 rounded-full items-center justify-center sm:px-4"
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
            <div className="mt-1 ml-8">
              <div className="text-lg font-bold">{user.Name}</div>
              <div className="text-gray-400 text-sm font-bold">
                {user.PostCount + " posts"}{" "}
              </div>
            </div>
          </div>
          <div className="flex items-center ml-4 mt-10">
            <div
              className="relative flex flex-col items-center justify-center hover:cursor-pointer"
              onClick={() =>
                document.getElementById("profile_picture").showModal()
              }
            >
              {getFromLocalStorage(defaultAddressKey) === user.Address && (
                <span
                  className={
                    "absolute bg-transparent border-transparent hover:visible " +
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
            {getFromLocalStorage(defaultAddressKey) === user.Address && (
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
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost">
                      ✕
                    </button>
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
              {getFromLocalStorage(defaultAddressKey) === user.Address && (
                <div className="flex flex-col items-center">
                  <input
                    className="text-xs mt-1 mb-6 w-2/3 ml-2"
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
              )}
            </div>
          </dialog>

          <div className="text-lg mt-4 ml-4 font-bold">{user.Name}</div>
          <div className="text-gray-500 ml-4">{"@" + user.Username}</div>
          <div
            className={
              "ml-4 mt-3 mb-4 text-sm " + (user.Username === "" ? "italic" : "")
            }
          >
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
            <div className="text-gray-500 ml-1 text-xs md:text-sm">
              {user.Address}
            </div>{" "}
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
          {/* <div className="ml-4 flex text-sm">
        <div className="flex">
          <div className="font-bold">0 </div>
          <div className="text-gray-500 ml-1">following</div>
        </div>
        <div className="flex ml-6">
          <div className="font-bold">0 </div>
          <div className="text-gray-500 ml-1">followers</div>
        </div>
      </div> */}
          <Suspense>
            <div className="flex flex-col">
              {posts.map((p, index = 0) => {
                return <PostView p={p} key={index} setRefresh={setRefresh} />;
              })}
            </div>

            <PostList
              offset={offset}
              setPosts={setPosts}
              refresh={refresh}
              user={user}
              userPost={true}
            />

            <div className="flex flex-col items-center mb-12">
              {!(offset + 10 > user.PostCount) && user.PostCount !== 0 ? (
                <div
                  className="btn btn-outline border-sky-500 text-sky-500 w-60 mt-4"
                  onClick={() => {
                    setOffset((offset) => offset + 10);
                  }}
                >
                  Load More
                </div>
              ) : (
                ""
              )}
            </div>
          </Suspense>
        </div>
        <hr className="h-screen border-l border-gray-200 opacity-25 sticky top-0 hidden sm:inline"></hr>
        <div className="w-1/4 p-4 hidden sm:inline">
          <Trending />
        </div>
        <div className="w-1/6 p-4"></div>
      </div>
    );
  if (!load)
    return (
      <div className="flex flex-col items-center h-screen">
        <span className="flex flex-row justify-center w-48">
          <div className="font-bold">POST</div>
          <div className="font-bold">.</div>
          <div className="text-sky-500 font-bold">it</div>
        </span>

        <div className="flex flex-col items-center h-screen">
          <div className="mt-48 text-5xl">Oops!</div>
          <div className="text-base text-gray-300 mt-5 mb-5">
            User Not Found
          </div>
          <Link
            href={"/"}
            className={
              "text-white font-bold rounded-full text-md px-6 py-2 text-center w-48 uppercase bg-sky-500 hover:bg-sky-600"
            }
          >
            GO TO HOME
          </Link>
        </div>
      </div>
    );
}
