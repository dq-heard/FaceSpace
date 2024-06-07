import { ChangeEvent, FC, ReactNode, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { User } from "../utils/types";
import { client } from "../client";
import Spinner from "./Spinner";
import { SanityClient, SanityImageAssetDocument } from "@sanity/client";

interface CreatePinProps {
  user: User | null;
  categories: { name: string }[];
}

const CreatePin: FC<CreatePinProps> = ({ user, categories }): ReactNode => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("");
  const [imageAsset, setImageAsset] = useState<SanityImageAssetDocument | null>(
    null
  );

  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const { type, name } = file;

      if (
        type === "image/jpeg" ||
        type === "image/png" ||
        type === "image/svg" ||
        type === "image/gif"
      ) {
        setWrongImageType(false);
        setLoading(true);

        client.assets
          .upload("image", e.target.files[0], {
            contentType: type,
            filename: name,
          })
          .then((document) => {
            setImageAsset(document);
            setLoading(false);
          })
          .catch((error) => {
            console.log("Image upload error ", error);
          });
      } else {
        setLoading(false);
        setWrongImageType(true);
      }
    }
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
  };

  const newPin = (client: SanityClient, user: User): void => {
    if (title && about && destination && imageAsset?._id && category && user) {
      const doc = {
        _type: "pin",
        title,
        about,
        destination,
        userID: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
        },
        category,
        published: true,
      };

      client.create(doc).then(() => {
        navigate("/");
      });
    } else {
      setFields("Please fill in all the fields.");
      setTimeout(() => setFields(null), 2000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">
          Please fill in all the fields.
        </p>
      )}

      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner message="Loading..." />}
            {wrongImageType && <p>Wrong Image Type</p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col items-center justify-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to Upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    {" "}
                    Use high-quality JPG, PNG, SVG, or GIF less than 20 MB.
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-photo"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add Title"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />
          {user && (
            <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
              <img
                src={user.image}
                alt="user-profile"
                className="w-10 h-10 rounded-full"
              />
              <p className="font-bold">{user.userName}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="What's your pin about?"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a link"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl">
                Choose Pin Category
              </p>

              <select
                value={category}
                onChange={handleCategoryChange}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="other">Select Category</option>
                {categories.map((cat) => (
                  <option
                    key={cat.name}
                    value={cat.name}
                    className="text-base border-0 outline-none capitalize bg-white text-black"
                  >
                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-end mt-5">
              <button
                type="button"
                onClick={() => user && newPin(client, user)}
                className="bg-sky-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
