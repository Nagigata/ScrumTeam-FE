import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

const GoogleLoginButton = ({
  onLoginSuccess,
  setErrorMessage,
  setIsLoading,
}) => {
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      setErrorMessage("");
      setIsLoading(true);

      const apiURL = process.env.REACT_APP_API_URL + "/user/google/";
      try {
        const res = await fetch(apiURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token_google: response.access_token }),
        });

        if (res.ok) {
          const data = await res.json();
          Cookies.set("access_token", data.access, { expires: 7 });
          Cookies.set("refresh_token", data.refresh, { expires: 7 });
          Cookies.set("is_first_login", data.is_first_login, { expires: 7 });
          localStorage.setItem("userRole", "candidate");
          window.location.href = "/";
        } else {
          const errorData = await res.json();
          setErrorMessage(
            errorData.message || "Google login failed. Please try again."
          );
        }
      } catch (error) {
        console.error("Google login error:", error);
        setErrorMessage("Network error. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      setErrorMessage("Google login failed. Please try again.");
    },
  });

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative flex py-3 items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-600">Or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-sm flex items-center justify-center transition duration-200"
        type="button"
        onClick={handleGoogleLogin}
      >
        <img
          src="assets/google.png"
          alt="Google logo"
          className="w-5 h-5 mr-2"
        />
        Sign in with Google
      </motion.button>
    </div>
  );
};

export default GoogleLoginButton;
