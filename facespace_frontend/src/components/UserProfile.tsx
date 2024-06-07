import { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";

import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { User, PinType } from "../utils/types";

const randomImage =
  "https://source.unsplash.com/1600x900/?nature,photography,technology";

const activeBtnStyles =
  "bg-sky-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const inactiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [pins, setPins] = useState<PinType[]>([]);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userID } = useParams();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    if (userID) {
      const query = userQuery(userID);

      client.fetch(query).then((data: User[]) => {
        setUser(data[0]);
      });
    }
  }, [userID]);

  useEffect(() => {
    if (userID) {
      if (text === "Created") {
        const createdPinsQuery = userCreatedPinsQuery(userID);

        client.fetch(createdPinsQuery).then((data) => {
          setPins(data);
        });
      } else {
        const savedPinsQuery = userSavedPinsQuery(userID);

        client.fetch(savedPinsQuery).then((data) => {
          setPins(data);
        });
      }
    }
  }, [text, userID]);

  if (!user) {
    return <Spinner message="Loading profile..." />;
  }
  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
              alt="banner-photo"
            />
            <img
              src={user.image}
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              alt="user-photo"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userID === user._id && (
                <button
                  type="button"
                  className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                  onClick={handleLogout}
                  disabled={false}
                >
                  <AiOutlineLogout color="red" fontSize={21} />
                </button>
              )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.textContent) {
                  setText(target.textContent);
                }

                setActiveBtn("created");
              }}
              className={`${
                activeBtn === "created" ? activeBtnStyles : inactiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.textContent) {
                  setText(target.textContent);
                }

                setActiveBtn("saved");
              }}
              className={`${
                activeBtn === "saved" ? activeBtnStyles : inactiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>

          <div className="px-2">
            {pins?.length ? (
              <MasonryLayout pins={pins} />
            ) : (
              <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
                No Pins Found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
