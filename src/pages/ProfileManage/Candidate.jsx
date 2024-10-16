import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import InputField from "../../components/Auth/InputField";
import AuthButton from "../../components/Auth/AuthButton";
import {
  AccountCircle,
  Phone as PhoneIcon,
  PhotoCamera as CameraIcon,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Cookies from "js-cookie";

const Candidate = () => {
  const [status, setStatus] = useState({ success: "", error: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/candidate/profile/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const uploadAvatar = async (file) => {
    const apiURL = process.env.REACT_APP_API_URL + "/candidate/upload-avatar/";
    const accessToken = Cookies.get("access_token");
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Avatar upload failed");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setStatus({ success: "", error: "" });
    setIsSubmitting(true);
    const apiURL = process.env.REACT_APP_API_URL + "/candidate/profile/";
    const accessToken = Cookies.get("access_token");

    try {
      if (values.avatar) {
        await uploadAvatar(values.avatar);
      }

      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: values.full_name,
          is_male: values.is_male,
          phone_number: values.phone_number,
        }),
      });

      if (response.ok) {
        setStatus({ success: "Profile updated successfully!", error: "" });
        fetchUserProfile();
      } else if (response.status === 401) {
        setStatus({ error: "Unauthorized. Please log in again.", success: "" });
      } else {
        const errorData = await response.json();
        setStatus({
          error:
            errorData.message ||
            "An error occurred while updating the profile.",
          success: "",
        });
      }
    } catch (error) {
      setStatus({
        error: "Network error. Please check your connection.",
        success: "",
      });
    }

    setIsSubmitting(false);
    setSubmitting(false);
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="max-w-md mx-auto p-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          Candidate Information
        </h2>

        <Formik
          initialValues={{
            full_name: userProfile.full_name || "",
            is_male: userProfile.is_male,
            phone_number: userProfile.phone_number || "",
            avatar: null,
            avatarPreview: userProfile.avatar || "",
          }}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form>
              {/* Upload Avatar with Camera Icon */}
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
                      <AccountCircle style={{ fontSize: 64, color: "gray" }} />
                    </div>
                  )}

                  <IconButton
                    component="label"
                    className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full text-white"
                    style={{
                      transform: "translate(160%, -90%)",
                    }}
                  >
                    <span className="flex items-center justify-center w-9 h-9 border-2 border-white rounded-full bg-black bg-opacity-60">
                      <CameraIcon
                        style={{ fontSize: "20px", color: "white" }}
                      />
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

              {/* Checkbox for Gender */}
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

              {/* AuthButton for Save Information */}
              <AuthButton
                label="Save Information"
                isLoading={isSubmitting}
                isSubmitting={isSubmitting}
              />
            </Form>
          )}
        </Formik>
        {status.success && (
          <div className="mt-4 text-center text-green-600">
            {status.success}
            {window.location.reload()}
          </div>
        )}
        {status.error && (
          <div className="mt-4 text-center text-red-600">{status.error}</div>
        )}
      </div>
    </div>
  );
};

export default Candidate;
