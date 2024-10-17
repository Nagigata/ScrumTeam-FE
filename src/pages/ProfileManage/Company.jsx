import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import InputField from "../../components/Auth/InputField";
import TextAreaField from "../../components/Auth/TextAreaField";
import AuthButton from "../../components/Auth/AuthButton";
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  DateRange as DateIcon,
  PhotoCamera as CameraIcon,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Cookies from "js-cookie";

const Company = () => {
  const [avatarUser, setAvatarUser] = useState(null);
  const [dataProfile, setDataProfile] = useState({});

  const accessToken = Cookies.get("access_token");

  useEffect(() => {
    const apiURL = process.env.REACT_APP_API_URL + "/company/profile/";

    const fetchData = async () => {
      try {
        const res = await fetch(apiURL, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        });

        if (res.status === 200) {
          const data = await res.json();
          setDataProfile(data || {});
          setAvatarUser(data.avatar ? data.avatar : "");
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
      name: values.name,
      description: values.description,
      hotline: values.hotline,
      website: values.website,
      founded_year: values.founded_year,
    };

    const apiURL = process.env.REACT_APP_API_URL + "/company/profile/";

    try {
      const res = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify(dataProfile),
      });

      if (res.ok) {
        alert("Thông tin được cập nhật thành công");
      } else {
        alert("Cập nhật thông tin thất bại");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const apiURL = process.env.REACT_APP_API_URL + "/company/upload-avatar/";
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUser(reader.result);
      };
      reader.readAsDataURL(file);

      try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await fetch(apiURL, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + accessToken,
          },
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Upload successful:", result);
        } else {
          throw new Error(`Error: ${response.statusText}`);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Your image format is invalid. Please select another one.");
    }
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          Company Information
        </h2>

        <Formik
          initialValues={{
            name: dataProfile.name || "",
            description: dataProfile.description || "",
            hotline: dataProfile.hotline || "",
            website: dataProfile.website || "",
            founded_year: dataProfile.founded_year || "",
          }}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form>
              {/* Avatar Upload Section */}
              <div className="relative mb-8 flex justify-center">
                <div className="relative w-32 h-32">
                  {avatarUser ? (
                    <img
                      src={avatarUser}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                      <BusinessIcon style={{ fontSize: 64, color: "gray" }} />
                    </div>
                  )}

                  <IconButton
                    component="label"
                    className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full text-white"
                    style={{ transform: "translate(160%, -90%)" }}
                  >
                    <span className="flex items-center justify-center w-9 h-9 border-2 border-white rounded-full bg-black bg-opacity-60">
                      <CameraIcon
                        style={{ fontSize: "20px", color: "white" }}
                      />
                    </span>
                    <input
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      onChange={handleImageChange}
                      hidden
                    />
                  </IconButton>
                </div>
              </div>

              {/* Form Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField
                  label="Company Name"
                  name="name"
                  type="text"
                  placeholder="Enter company name"
                  icon={BusinessIcon}
                  errors={errors}
                  touched={touched}
                />

                <InputField
                  label="Hotline"
                  name="hotline"
                  type="tel"
                  placeholder="Enter hotline number"
                  icon={PhoneIcon}
                  errors={errors}
                  touched={touched}
                />

                <InputField
                  label="Website"
                  name="website"
                  type="url"
                  placeholder="Enter company website"
                  icon={WebsiteIcon}
                  errors={errors}
                  touched={touched}
                />

                <InputField
                  label="Founded Year"
                  name="founded_year"
                  type="date"
                  placeholder="Enter founded year"
                  icon={DateIcon}
                  errors={errors}
                  touched={touched}
                />
              </div>

              {/* Description TextArea with Full Width */}
              <div className="my-8">
                <TextAreaField
                  label="Description"
                  name="description"
                  placeholder="Enter company description"
                  icon={BusinessIcon}
                  rows={6}
                  style={{ height: "150px" }}
                  errors={errors}
                  touched={touched}
                />
              </div>

              {/* Save Information Button */}
              <AuthButton
                label="Save Information"
                type="submit"
                className="w-auto"
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Company;
