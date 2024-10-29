import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthSection from "../../components/Auth/AuthSection";
import RoleSelect from "./RoleSelect";
import UserSignUp from "./UserSignUp";
import RecruiterSignUp from "./RecruiterSignUp";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "./GoogleLoginButton";

const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleBackClick = () => {
    setRole("");
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setErrorMessage("");
    console.log({
      username: values.username,
      password: values.password,
      email: values.email,
      user_role: role,
    });

    const apiURL = process.env.REACT_APP_API_URL + "/user/register/";
    const userRole = role;

    // Chuẩn bị dữ liệu theo role
    const bodyData = {
      password: values.password,
      user_role: userRole,
    };

    if (role === "candidate") {
      bodyData.username = values.username;
      bodyData.email = values.email;
    } else {
      bodyData.username = values.companyName;
      bodyData.email = values.companyEmail;
    }
    console.log(bodyData);
    try {
      const res = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (res.status === 201) {
        alert("Account created successfully!");
        navigate("/login");
      } else if (res.status === 400) {
        const errorData = await res.json();
        console.error("Server error:", errorData);
        setErrorMessage("Username or email already exists. Please try again.");
      } else {
        setErrorMessage("Server error. Please try again later.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please check your connection.");
    }

    setIsLoading(false);
    setSubmitting(false);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="flex h-screen bg-[#e6f9f3]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="m-auto bg-white rounded-xl shadow-2xl flex overflow-hidden"
          style={{ width: "70vw", height: "80vh" }}
        >
          <div className="flex w-full h-full">
            <div className="w-1/2 p-12 overflow-y-auto custom-scrollbar">
              {role === "" ? (
                <RoleSelect setRole={setRole} />
              ) : (
                <>
                  <motion.button
                    onClick={handleBackClick}
                    className="mb-6 flex items-center text-blueColor hover:text-[#535ac8] font-semibold transition duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <KeyboardArrowLeftOutlinedIcon className="mr-1" />
                    <span>Back</span>
                  </motion.button>
                  <h2 className="text-3xl font-bold mb-8 text-blueColor">
                    {role === "candidate"
                      ? "Create Candidate Account"
                      : "Create Recruiter Account"}
                  </h2>
                  {role === "candidate" ? (
                    <UserSignUp
                      handleSubmit={handleSubmit}
                      errorMessage={errorMessage}
                      isLoading={isLoading}
                      isSubmitting={isLoading}
                    />
                  ) : (
                    <RecruiterSignUp
                      handleSubmit={handleSubmit}
                      errorMessage={errorMessage}
                      isLoading={isLoading}
                      isSubmitting={isLoading}
                    />
                  )}
                  <div className="mt-4">
                    <GoogleLoginButton
                      onLoginSuccess={navigate}
                      setErrorMessage={setErrorMessage}
                      setIsLoading={setIsLoading}
                    />
                  </div>
                  <div className="mt-6 text-sm text-gray-500 text-center">
                    Already have an account?{" "}
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href="#"
                      className="text-blueColor hover:text-[#535ac8] font-semibold transition duration-200"
                    >
                      <Link to="/login">Log In</Link>
                    </motion.a>
                  </div>
                </>
              )}
            </div>
            <AuthSection
              title="JOIN OUR PROFESSIONAL NETWORK"
              description="Sign up to connect with industry leaders, explore job openings, and advance your IT career with DevHunt."
              backgroundImage="/assets/bg-signup.png"
              isSignUp={true}
            />
          </div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignUp;
