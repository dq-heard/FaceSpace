import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { PinType, SaveType } from "../utils/types";
import { client, urlFor } from "../client";
import { fetchUser } from "../utils/fetchUser";

type PinProps = {
  pin: PinType;
  className: string;
};

const Pin: FC<PinProps> = ({ pin, className }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const navigate = useNavigate();

  const user = fetchUser();

  const { postedBy, image, _id, destination } = pin;

  let alreadySaved = pin.save?.filter(
    (item) => item.postedBy._ref === user?.googleID
  );

  let saveCount = alreadySaved ? pin?.save?.length : 0;

  const savePin = (id: string) => {
    if (saveCount == 0) {
      setSavingPost(true);

      const newSaveEntry: SaveType = {
        _key: uuidv4(),
        userID: user?.googleID || "",
        postedBy: {
          _ref: user?.googleID || "",
        },
        pin: { _type: "reference", _ref: id },
        _type: "save",
      };

      client
        .create(newSaveEntry)
        .then(() => {
          client
            .patch(id)
            .setIfMissing({ save: [] })
            .insert("after", "save[-1]", [newSaveEntry])
            .commit()
            .then(() => {
              window.location.reload();
              setSavingPost(false);
            })
            .catch((error: Error) => {
              console.error("Error updating Pin document:", error);
              setSavingPost(false);
            });
        })
        .catch((error: Error) => {
          console.error("Error creating Save document:", error);
          setSavingPost(false);
        });
    }
  };

  const deletePin = (id: string) => {
    client
      .delete(id)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error deleting pin:", error);
      });
  };

  return (
    <div className={classNames("m-2", className)} key={_id}>
      <div
        onMouseEnter={() => {
          setPostHovered(true);
        }}
        onMouseLeave={() => {
          setPostHovered(false);
        }}
        onClick={() => {
          navigate(`/pin-detail/${_id}`);
        }}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          className="rounded-lg w-full"
          alt="user-post"
          src={urlFor(image).width(250).url()}
        />
        {postHovered && (
          <div
            className="absolute top-0 h-full w-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {saveCount !== 0 ? (
                <button
                  disabled
                  type="button"
                  className="bg-sky-500 opacity-70 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {saveCount} Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-sky-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {savingPost ? "Saving" : "Save"}
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity=100 hover:shadow-md"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 15
                    ? `${destination.slice(0, 15)}...`
                    : destination}
                </a>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePin(_id);
                }}
                className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
              >
                <AiTwotoneDelete />
              </button>
            </div>
          </div>
        )}
      </div>
      <Link
        to={`user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          src={postedBy?.image}
          alt="user-profile"
          className="w-8 h-8 rounded-full object-cover"
        />

        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
