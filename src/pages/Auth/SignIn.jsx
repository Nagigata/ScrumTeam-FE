import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AuthSection from "../../components/Auth/AuthSection";
import InputField from "../../components/Auth/InputField";
import AuthButton from "../../components/Auth/AuthButton";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setErrorMessage("");

    const apiURL = process.env.REACT_APP_API_URL + "/user/login/";
    try {
      const res = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      if (res.status === 200) {
        localStorage.setItem("username", values.username);
        navigate("/");
      } else if (res.status === 400) {
        setErrorMessage(
          "Login failed. Please check your username or password."
        );
      } else {
        setErrorMessage("Server error. Please try again later.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please check your connection.");
    }

    setIsLoading(false);
    setSubmitting(false);
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    console.log(token);
    setErrorMessage("");

    const apiURL = process.env.REACT_APP_API_URL + "/user/google/";
    try {
      const res = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token_google: token }),
      });

      if (res.status === 200) {
        const data = await res.json();
        if (data.is_first_login) {
          navigate("/login");
        } else {
          navigate("/");
        }
      } else {
        const errorData = await res.json();
        setErrorMessage(
          errorData.message || "Google login failed. Please try again."
        );
      }
    } catch (error) {
      setErrorMessage("Network error. Please check your connection.");
    }
  };

  const handleGoogleLoginFailure = (error) => {
    setErrorMessage("Google login failed. Please try again.");
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
            {/* Left section */}
            <AuthSection
              title="WELCOME TO"
              description="Sign in to explore job opportunities, connect with top companies, and take the next step in your IT career."
              backgroundImage="/assets/bg-login.png"
            />

            {/* Right section */}
            <div className="w-1/2 p-12 overflow-y-auto">
              <h2 className="text-3xl font-bold mb-8 text-blueColor">
                Login to your account
              </h2>
              <Formik
                initialValues={{ username: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <InputField
                      label="Username"
                      name="username"
                      type="username"
                      placeholder="Enter your username"
                      icon={PersonOutlineOutlinedIcon}
                      errors={errors}
                      touched={touched}
                    />
                    <InputField
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      icon={LockOutlinedIcon}
                      errors={errors}
                      touched={touched}
                    />
                    {errorMessage && (
                      <div className="mb-4 text-red-500 text-sm">
                        {errorMessage}
                      </div>
                    )}

                    <div className="mb-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blueColor"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Remember me
                        </span>
                      </label>
                    </div>
                    <div className="flex flex-col space-y-4">
                      <AuthButton
                        label="Sign in"
                        isLoading={isLoading}
                        isSubmitting={isSubmitting}
                      />
                      <div className="relative flex py-3 items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-600">
                          Or
                        </span>
                        <div className="flex-grow border-t border-gray-300"></div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center transition duration-200"
                        type="button"
                      >
                        <GoogleLogin
                          onSuccess={handleGoogleLoginSuccess}
                          onFailure={handleGoogleLoginFailure}
                          ux_mode="popup"
                          locale="en"
                          useOneTap="true"
                        />
                      </motion.button>
                    </div>
                  </Form>
                )}
              </Formik>

              <div className="mt-6 text-sm text-gray-500 text-center">
                Don’t have an account?{" "}
                <Link to="/register" className="text-blueColor font-bold">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignIn;
