import { useEffect, useRef, useState } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";

import { Sidebar, UserProfile } from "../components";
import Pins from "./Pins";
import { userQuery, feedQuery } from "../utils/data";
import { PinDetailType, User } from "../utils/types";
import logo from "../assets/full_logo(1).png";
import { fetchUser } from "../utils/fetchUser";
import { client } from "../client"; // Import your client module
import Spinner from "../components/Spinner";

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [pin, setPin] = useState<PinDetailType | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async (query: string) => {
      try {
        const response = await client.fetch(query);
        return response;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };

    const fetchUserData = async () => {
      try {
        const userInfo = fetchUser();
        if (!userInfo || !userInfo.googleID) {
          console.error("User information or googleID missing:", userInfo);
          return;
        }

        const query = userQuery(userInfo.googleID);
        const userData = await fetchData(query);

        if (Array.isArray(userData) && userData.length > 0) {
          setUser(userData[0]);
        } else {
          console.error("No user data found for query:", query);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchPin = async (query: string) => {
      try {
        const response = await client.fetch(query);
        return response;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };

    const fetchPinData = async () => {
      try {
        const query = feedQuery;
        const pinData = await fetchPin(query);

        setPin(pinData);
      } catch (error) {
        console.error("Error fetching pin data:", error);
      }
    };

    fetchPinData();

    if (scrollRef.current !== null) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>

      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          {user && user.image && (
            <Link to={`user-profile/${user._id}`}>
              <img src={user.image} alt="Profile Image" className="w-12" />
            </Link>
          )}
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>

      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userID" element={<UserProfile />} />
          {pin ? (
            <Route path="/*" element={<Pins user={user && user} pin={pin} />} />
          ) : (
            <Route path="/*" element={<Spinner message="Loading..." />} />
          )}
        </Routes>
      </div>
    </div>
  );
};

export default Home;
