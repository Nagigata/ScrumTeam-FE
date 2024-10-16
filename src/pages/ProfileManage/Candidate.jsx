import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import InputField from "../../components/Auth/InputField";
import AuthButton from "../../components/Auth/AuthButton";
import { AccountCircle, Phone as PhoneIcon, PhotoCamera as CameraIcon } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import Cookies from "js-cookie";

const Candidate = () => {
  const [avatarUser, setAvatarUser] = useState(null);
  const [dataProfile, setDataProfile] = useState({});

  const accessToken = Cookies.get("access_token");

  useEffect(() => {
    const apiURL = process.env.REACT_APP_API_URL + "/candidate/profile/";
  
    const fetchData = async () => {
      try {
        const res = await fetch(apiURL, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        });
  
        if (res.status === 200) {
          const data = await res.json();
          setDataProfile(data || {});
          setAvatarUser(data.avatar ? data.avatar : '');
          console.log(">>> Data: ", data);
        } else {
          console.log("Không thể lấy dữ liệu hồ sơ");
        }
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu:", error);
      }
    };
  
    fetchData();
  }, [accessToken]);

  const handleSubmit = async (values) => {
    const dataProfile = {
      full_name: values.full_name,
      is_male: values.is_male,
      phone_number: values.phone_number,
    };
  
    const apiURL = process.env.REACT_APP_API_URL + "/candidate/profile/";
  
    try {
      const res = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
        body: JSON.stringify(dataProfile),
      });
  
      if (res.ok) {
        alert('Thông tin được cập nhật thành công');
      } else {
        alert('Cập nhật thông tin thất bại');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const apiURL = process.env.REACT_APP_API_URL + "/candidate/upload-avatar/";
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarUser(reader.result);
        };
        reader.readAsDataURL(file);

        try {
          const formData = new FormData();
          formData.append('avatar', file);
      
          const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
            body: formData,
          });
      
          if (response.ok) {
            const result = await response.json();
            console.log('Upload successful:', result);
          } else {
            throw new Error(`Error: ${response.statusText}`);
          }
        } catch(error) {
          console.log(error);
        }
    } else {
        alert('Your image format is invalid. Please select another one.');
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto p-4">
        <h2 className="text-2xl font-bold text-center mb-8">Candidate Information</h2>

        <Formik  
          initialValues={{
            full_name: dataProfile.full_name || '',
            is_male: dataProfile.is_male || true,
            phone_number: dataProfile.phone_number || '',
            avatarPreview: '',
          }} 
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form>
              {/* Upload Avatar với Biểu Tượng Camera */}
              <div className="relative mb-6 flex flex-col items-center">
                <div className="relative w-32 h-32">
                  {avatarUser ? (
                    <img 
                      src={avatarUser} 
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
                      accept='.jpg, .jpeg, .png'
                      onChange={handleImageChange}
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