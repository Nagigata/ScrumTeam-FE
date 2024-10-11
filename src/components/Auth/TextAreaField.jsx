import React from "react";
import { Field } from "formik";

const TextAreaField = ({ label, name, placeholder, rows, errors, touched }) => {
  return (
    <div className="mb-6">
      <label
        className="block text-[#19ADC8] text-sm font-semibold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <Field
        as="textarea"
        className={`w-full pl-3 pr-3 py-3 rounded-lg border-2 ${
          errors[name] && touched[name] ? "border-red-500" : "border-gray-200"
        } outline-none focus:border-[#19ADC8] transition duration-200`}
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
      />
      {errors[name] && touched[name] && (
        <div className="text-red-500 text-sm mt-1">{errors[name]}</div>
      )}
    </div>
  );
};

export default TextAreaField;
