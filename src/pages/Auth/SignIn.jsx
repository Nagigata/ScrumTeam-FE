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
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "./GoogleLoginButton";
import Cookies from "js-cookie";

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
        const data = await res.json();
        localStorage.setItem("username", values.username);
        localStorage.setItem("userRole", "recruiter");
        Cookies.set("access_token", data.access, { expires: 7 });
        Cookies.set("refresh_token", data.refresh, { expires: 7 });
        window.location.href = "/recruiter";
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
            <AuthSection
              title="WELCOME TO"
              description="Sign in to explore job opportunities, connect with top companies, and take the next step in your IT career."
              backgroundImage="/assets/bg-login.png"
            />

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
                    <div className="space-y-4">
                      <AuthButton
                        label="Sign in"
                        isLoading={isLoading}
                        isSubmitting={isSubmitting}
                      />
                      <GoogleLoginButton
                        onLoginSuccess={navigate}
                        setErrorMessage={setErrorMessage}
                        setIsLoading={setIsLoading}
                      />
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
