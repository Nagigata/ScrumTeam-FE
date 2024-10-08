import React from "react";
import { Formik, Form } from "formik";
import InputField from "../../components/Auth/InputField";
import AuthButton from "../../components/Auth/AuthButton";
import { AccountCircle, Email as MailIcon, Phone as PhoneIcon, PhotoCamera as CameraIcon } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import NavBar from "../../components/ProfileManage/NavBar"; 

const Candidate = () => {
  const initialValues = {
    avatar: null,
    avatarPreview: '',
    username: '',
    email: '',
    sdt: '',
  };

  const handleEdit = (values) => {
    console.log("Editing info", values);
  };

  return (
    <div>
      <NavBar /> 
      <div className="max-w-md mx-auto p-4">
        <h2 className="text-2xl font-bold text-center mb-8">Candidate Information</h2>
        
        <Formik
          initialValues={initialValues}
          onSubmit={handleEdit}
        >
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
                label="Username"
                name="username"
                type="text"
                placeholder="Enter username"
                icon={AccountCircle}
                errors={errors} 
                touched={touched}
              />

              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email"
                icon={MailIcon}
                errors={errors} 
                touched={touched}
              />

              <InputField
                label="Phone Number"
                name="sdt"
                type="tel"
                placeholder="Enter phone number"
                icon={PhoneIcon}
                errors={errors} 
                touched={touched}
              />

              <div className="flex flex-col mt-4 space-y-2">
                <div className="flex justify-between space-x-2">
                  <AuthButton
                    label="Save Information"
                    type="submit"
                    className="flex-1" // Để nút chiếm không gian đều
                  />
                  <AuthButton
                    label="Change Password"
                    onClick={() => console.log("Change Password")}
                    className="flex-1" 
                  />
                </div>
                <AuthButton
                  label="Delete Account"
                  onClick={() => console.log("Delete Account")}
                  style={{ backgroundColor: 'red' }}
                  className="mt-2" 
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Candidate;
