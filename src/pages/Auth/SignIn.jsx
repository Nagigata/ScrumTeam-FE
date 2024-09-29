import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
// import { signIn } from "../../services/apiService";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AuthSection from "../../components/AuthSection";
import InputField from "../../components/InputField";
import AuthButton from "../../components/AuthButton";
import Cookies from "js-cookie";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const SignInForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setErrorMessage("");
    console.log(values.email, values.password);
    // try {
    //   const response = await signIn(values.email, values.password);

    //   if (response.status === 200) {
    //     Cookies.set("adminEmail", values.email, { expires: 7 });
    //     navigate("/verificationCode");
    //   }
    // } catch (error) {
    //   if (error.response) {
    //     const message =
    //       error.response.data?.message || "Login failed. Please try again.";
    //     setErrorMessage(message);
    //   } else {
    //     setErrorMessage("Network error. Please check your connection.");
    //   }
    // }

    setIsLoading(false);
    setSubmitting(false);
  };

  return (
    <div className="flex h-screen bg-[#22272E]">
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
            description="Log in to explore job opportunities, connect with top companies, and take the next step in your IT career."
            backgroundImage="/assets/bg-login.png"
          />

          {/* Right section */}
          <div className="w-1/2 p-12 overflow-y-auto">
            <h2 className="text-3xl font-bold mb-8 text-[#19ADC8]">
              Login to your account
            </h2>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
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
                  {errorMessage && (
                    <div className="mb-4 text-red-500 text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-[#19ADC8]"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Remember me
                      </span>
                    </label>
                  </div>
                  <AuthButton
                    label="Sign in"
                    isLoading={isLoading}
                    isSubmitting={isSubmitting}
                  />
                </Form>
              )}
            </Formik>

            <div className="mt-6 text-sm text-gray-500 text-center">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-[#19ADC8] font-bold">
                Register
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignInForm;
