import axios from "axios";
import {
  GoogleOAuthProvider,
  useGoogleLogin,
  TokenResponse,
} from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { client as sanityClient } from "../client";

import video from "../assets/video.mp4";
import logo from "../assets/full_logo.png";

const Login = () => {
  const clientID = import.meta.env.VITE_GOOGLE_API_TOKEN as string;

  return (
    <GoogleOAuthProvider clientId={clientID}>
      <LoginButton />
    </GoogleOAuthProvider>
  );
};

const LoginButton = () => {
  const navigate = useNavigate();

  const responseGoogle = (
    response: Omit<TokenResponse, "error" | "error_description" | "error_uri">
  ) => {
    const { access_token } = response;
    if (access_token) {
      localStorage.setItem("user", JSON.stringify(access_token));
      fetchUserInfo(access_token); // Call fetchUserInfo to store user data in Sanity
    }
  };

  const fetchUserInfo = async (accessToken: string) => {
    try {
      const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { name, sub: googleID, picture: imageUrl } = userInfoResponse.data;

      // Create a user object with the fetched information
      const user = {
        googleID,
        name,
        imageUrl,
      };

      // Store the user object in local storage
      localStorage.setItem("user", JSON.stringify(user));

      // Store user information in Sanity backend
      const doc = {
        _id: googleID,
        _type: "user",
        userName: name,
        image: imageUrl,
      };
      await sanityClient.createIfNotExists(doc);

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  const errorResponseGoogle = () => {
    // Show an error message to the user
    alert(
      "An error occurred while trying to log in with Google. Please try again."
    );

    // Optionally, you could log the error for debugging purposes
    console.error("Google login error");
  };

  const login = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: errorResponseGoogle,
  });

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 bottom-0 left-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} className="pb-3 mx-auto" alt="logo" width="130px" />

            <div className="shadow-2xl">
              <button
                type="button"
                className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                onClick={() => login()}
                disabled={false}
              >
                <FcGoogle className="mr-4" />
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
