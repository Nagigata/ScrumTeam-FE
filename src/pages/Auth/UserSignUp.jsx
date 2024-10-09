import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InputField from "../../components/Auth/InputField";
import AuthButton from "../../components/Auth/AuthButton";

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

const UserSignUp = ({
  handleSubmit,
  errorMessage,
  isLoading,
  isSubmitting,
}) => {
  return (
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
      {({ errors, touched }) => (
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
            <div className="mb-4 mt-4 text-red-500 text-sm">{errorMessage}</div>
          )}
          <div className="space-y-4 pt-3">
            <AuthButton
              label="Sign up"
              isLoading={isLoading}
              isSubmitting={isSubmitting}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserSignUp;
