import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
// import { signUp } from "../../services/apiService";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AuthSection from "../../components/Auth/AuthSection";
import InputField from "../../components/Auth/InputField";
import AuthButton from "../../components/Auth/AuthButton";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setErrorMessage("");

    const apiURL = process.env.REACT_APP_API_URL + "/user/register/";

    try {
      const res = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          email: values.email,
        }),
      });

      if (res.status === 201) {
        alert("Account created successfully!");
        navigate("/login");
      } else if (res.status === 400) {
        const data = await res.json();
        setErrorMessage(data.message || "Sign up failed. Please try again.");
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
            {/* Right section */}
            <div className="w-1/2 p-12 overflow-y-auto custom-scrollbar">
              <style jsx>{`
                .custom-scrollbar {
                  direction: rtl;
                }
                .custom-scrollbar > * {
                  direction: ltr;
                }
              `}</style>
              <h2 className="text-3xl font-bold mb-8 text-blueColor">
                Create your account
              </h2>
              <Formik
                initialValues={{
                  username: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <InputField
                      label="Username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      icon={PersonOutlineOutlinedIcon}
                      errors={errors}
                      touched={touched}
                    />
                    <InputField
                      label="E-mail Address"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      icon={EmailOutlinedIcon}
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
                    <InputField
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      icon={LockOutlinedIcon}
                      errors={errors}
                      touched={touched}
                    />
                    {errorMessage && (
                      <div className=" mb-4 mt-4 text-red-500 text-sm ">
                        {errorMessage}
                      </div>
                    )}
                    <div className="flex flex-col space-y-4">
                      <AuthButton
                        label="Sign up"
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
              <p className="mt-6 text-sm text-gray-500 text-center">
                Already have an account?{" "}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href="#"
                  className="text-blueColor hover:text-[#535ac8] font-semibold transition duration-200"
                >
                  <Link to="/login">Log In</Link>
                </motion.a>
              </p>
            </div>
            {/* Left section */}
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
