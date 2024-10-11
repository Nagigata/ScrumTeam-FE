import React from "react";
import { Field } from "formik";

const InputField = ({
  label,
  name,
  type,
  placeholder,
  icon: Icon,
  errors,
  touched,
}) => {
  return (
    <div className="mb-6">
      <label
        className="block text-[#19ADC8] text-sm font-semibold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-[#010101]" />
        </span>
        <Field
          className={`w-full pl-10 pr-3 py-3 rounded-lg border-2 ${
            errors[name] && touched[name] ? "border-red-500" : "border-gray-200"
          } outline-none focus:border-[#19ADC8] transition duration-200`}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
        />
      </div>
      {errors[name] && touched[name] && (
        <div className="text-red-500 text-sm mt-1">{errors[name]}</div>
      )}
    </div>
  );
};

export default InputField;
