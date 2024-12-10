import React, { useState } from "react";
import { Field } from "formik";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const PasswordInputField = ({
  label = "Password",
  name = "password",
  placeholder = "Enter your password",
  icon: Icon = LockOutlinedIcon,
  errors,
  touched,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-6">
      <label className="block text-[#19ADC8] text-sm font-semibold mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-[#19ADC8]" />
        </div>
        <Field
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          className={`w-full pl-10 pr-3 py-3 rounded-lg border-2 ${
            errors[name] && touched[name] ? "border-red-500" : "border-gray-200"
          } outline-none focus:border-[#19ADC8] transition duration-200`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? (
            <VisibilityOffIcon className="h-5 w-5 text-blueColor hover:text-[#535ac8]" />
          ) : (
            <VisibilityIcon className="h-5 w-5 text-blueColor hover:text-[#535ac8]" />
          )}
        </button>
      </div>
      {errors[name] && touched[name] && (
        <div className="text-red-500 text-sm mt-1">{errors[name]}</div>
      )}
    </div>
  );
};

export default PasswordInputField;
