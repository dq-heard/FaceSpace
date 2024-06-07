import { PinDetailType, User } from "../utils/types";
import { FC, ReactNode, SetStateAction, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Spinner from "../components/Spinner";

import { Navbar, Feed, PinDetail, CreatePin, Search } from "../components";
import { categories } from "../utils/data";

interface PinsProps {
  user: User | null;
  pin: PinDetailType | undefined;
}

const Pins: FC<PinsProps> = ({ user, pin }): ReactNode => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!pin) {
    return <Spinner message="Loading..." />;
  }

  const feedComponent = !searchTerm ? <Feed /> : null;

  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
        />
      </div>
      <div className="h-full">
        <Routes>
          <Route path="/" element={feedComponent} />
          <Route path="/category/:categoryID" element={feedComponent} />
          <Route
            path="/pin-detail/:pinID"
            element={<PinDetail user={user} pin={pin} />}
          />
          <Route
            path="/create-pin"
            element={<CreatePin user={user} categories={categories} />}
          />
        </Routes>
        {searchTerm && (
          <Search
            searchTerm={searchTerm}
            setSearchTerm={function (_value: SetStateAction<string>): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Pins;
