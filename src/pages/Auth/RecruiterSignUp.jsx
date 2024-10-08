import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InputField from "../../components/Auth/InputField";
import AuthButton from "../../components/Auth/AuthButton";

const validationSchema = Yup.object().shape({
  companyName: Yup.string()
    .min(3, "Company name must be at least 3 characters")
    .required("Company name is required"),
  companyEmail: Yup.string()
    .email("Invalid email address")
    .required("Company email is required"),
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

const RecruiterSignUp = ({
  handleSubmit,
  errorMessage,
  isLoading,
  isSubmitting,
}) => {
  return (
    <Formik
      initialValues={{
        companyName: "",
        companyEmail: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <InputField
            label="Company Name"
            name="companyName"
            type="text"
            placeholder="Enter your company name"
            icon={BusinessOutlinedIcon}
            errors={errors}
            touched={touched}
          />
          <InputField
            label="Company E-mail Address"
            name="companyEmail"
            type="email"
            placeholder="Enter your company email"
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
          <div className="flex flex-col space-y-4 pt-3">
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

export default RecruiterSignUp;
