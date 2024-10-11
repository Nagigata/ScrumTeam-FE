import React from "react";
import { Formik, Form } from "formik";
import InputField from "../../components/Auth/InputField";
import TextAreaField from "../../components/Auth/TextAreaField";
import AuthButton from "../../components/Auth/AuthButton";
import { Business as BusinessIcon, Phone as PhoneIcon, Language as WebsiteIcon, DateRange as DateIcon, PhotoCamera as CameraIcon } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import NavBar from "../../components/ProfileManage/NavBar";

const Company = () => {
  const initialValues = {
    name: '',
    description: '',
    hotline: '',
    website: '',
    founded_year: '',
    avatar: null,
    avatarPreview: '',
  };

  const handleSubmit = (values) => {
    console.log("Company Form Values:", values);
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-center mb-8">Company Information</h2>

        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ errors, touched, setFieldValue, values }) => (
            <Form>
              {/* Avatar Upload Section */}
              <div className="relative mb-8 flex justify-center">
                <div className="relative w-32 h-32">
                  {values.avatarPreview ? (
                    <img 
                      src={values.avatarPreview} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                      <BusinessIcon style={{ fontSize: 64, color: 'gray' }} />
                    </div>
                  )}

                  <IconButton
                    component="label"
                    className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full text-white"
                    style={{ transform: 'translate(160%, -90%)' }}
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
                  style={{ height: '150px' }}
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
