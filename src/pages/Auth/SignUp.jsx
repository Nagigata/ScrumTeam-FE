import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
// import { checkCode, signUp } from "../../services/apiService";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AuthSection from "../../components/AuthSection";
import InputField from "../../components/InputField";
import AuthButton from "../../components/AuthButton";

const validationSchema = Yup.object().shape({
  fullname: Yup.string()
    .min(3, "Full name must be at least 3 characters")
    .required("Full name is required"),
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

const SignUpForm = () => {
  const [verificationError, setVerificationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setVerificationError("");
    console.log(values.email, values.fullname, values.password);
    // try {
    //   const response = await signUp(
    //     values.verificationCode,
    //     values.email,
    //     values.fullname,
    //     values.password,
    //     values.country,
    //     values.birthday
    //   );

    //   if (response.status === 200) {
    //     alert("User created successfully!");
    //   }
    // } catch (error) {
    //   if (error.response) {
    //     const message =
    //       error.response.data?.message || "Sign up failed. Please try again.";
    //     setVerificationError(message);
    //   } else {
    //     setVerificationError("Network error. Please check your connection.");
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
            <h2 className="text-3xl font-bold mb-8 text-[#19ADC8]">
              Create your account
            </h2>
            <Formik
              initialValues={{
                fullname: "",
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
                    label="Full Name"
                    name="fullname"
                    type="text"
                    placeholder="Enter your full name"
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
                  {verificationError && (
                    <div className=" mb-4 mt-4 text-red-500 text-sm ">
                      {verificationError}
                    </div>
                  )}
                  <AuthButton
                    label="Sign Up"
                    isLoading={isLoading}
                    isSubmitting={isSubmitting}
                  />
                </Form>
              )}
            </Formik>
            <p className="text-center mt-8 text-gray-600">
              Already have an account?{" "}
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="#"
                className="text-[#19ADC8] hover:text-[#535ac8] font-semibold transition duration-200"
              >
                <Link to="/login">Log In</Link>
              </motion.a>
            </p>
          </div>
          {/* Left section */}
          <AuthSection
            title="JOIN OUR PROFESSIONAL NETWORK"
            description="Sign up to connect with industry leaders, explore job openings, and advance your IT career with Millennium."
            backgroundImage="/assets/bg-signup.png"
            isSignUp={true}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpForm;
