import React from "react";
import { Formik, Form } from "formik";
import InputField from "../../components/Auth/InputField";
import AuthButton from "../../components/Auth/AuthButton";
import { AccountCircle, Phone as PhoneIcon, PhotoCamera as CameraIcon } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import NavBar from "../../components/ProfileManage/NavBar";

const Candidate = () => {
  const initialValues = {
    full_name: '',
    is_male: true, // Mặc định là true
    phone_number: '',
    avatar: null, // Tệp avatar
    avatarPreview: '', // Để hiển thị trước avatar
  };

  const handleSubmit = (values) => {
    console.log("Form Values:", values); // Tạm thời chỉ log ra giá trị form
  };

  return (
    <div>

      <div className="max-w-md mx-auto p-4">
        <h2 className="text-2xl font-bold text-center mb-8">Candidate Information</h2>

        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ errors, touched, setFieldValue, values }) => (
            <Form>
              {/* Upload Avatar với Biểu Tượng Camera */}
              <div className="relative mb-6 flex flex-col items-center">
                <div className="relative w-32 h-32">
                  {values.avatarPreview ? (
                    <img 
                      src={values.avatarPreview} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                      <AccountCircle style={{ fontSize: 64, color: 'gray' }} />
                    </div>
                  )}

                  <IconButton
                    component="label"
                    className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full text-white"
                    style={{
                      transform: 'translate(160%, -90%)', // Điều chỉnh vị trí camera icon
                    }}
                  >
                    <span className="flex items-center justify-center w-9 h-9 border-2 border-white rounded-full bg-black bg-opacity-60">
                      <CameraIcon style={{ fontSize: '20px', color: 'white' }} />
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue("avatar", file);
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFieldValue("avatarPreview", reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      hidden
                    />
                  </IconButton>
                </div>
              </div>

              <InputField
                label="Full Name"
                name="full_name"
                type="text"
                placeholder="Enter full name"
                icon={AccountCircle}
                errors={errors}
                touched={touched}
              />

              <InputField
                label="Phone Number"
                name="phone_number"
                type="tel"
                placeholder="Enter phone number"
                icon={PhoneIcon}
                errors={errors}
                touched={touched}
              />

              {/* Checkbox cho Giới tính */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_male"
                    className="mr-2"
                    checked={values.is_male}
                    onChange={() => setFieldValue("is_male", !values.is_male)}
                    style={{
                      width: "14px", 
                      height: "14px", 
                      transform: "scale(1.5)", 
                    }}
                  />
                  Is Male
                </label>
              </div>

              {/* Button Save Information */}
              <AuthButton
                label="Save Information"
                type="submit"
                className="w-full"
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Candidate;
