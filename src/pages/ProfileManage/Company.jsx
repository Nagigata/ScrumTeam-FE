import React from "react";
import { Formik, Form, Field } from "formik";
import { TextField } from "@mui/material";
import AuthButton from "../../components/Auth/AuthButton";
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  DateRange as DateIcon,
  PhotoCamera as CameraIcon,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputAdornment,
} from "@mui/material";

const Company = ({ onClose }) => {
  const initialValues = {
    name: "",
    description: "",
    hotline: "",
    website: "",
    founded_year: "",
    avatar: null,
    avatarPreview: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Company Form Values:", values);
    setSubmitting(false);
    onClose && onClose();
  };

  return (
    <>
      <DialogTitle>Edit Company Profile</DialogTitle>
      <DialogContent>
        <div className="max-w-4xl mx-auto p-4">
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ errors, touched, setFieldValue, values, isSubmitting }) => (
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
                  <Field
                    as={TextField}
                    label="Company Name"
                    name="name"
                    type="text"
                    placeholder="Enter company name"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon />
                        </InputAdornment>
                      ),
                    }}
                    error={touched.name && errors.name}
                    helperText={touched.name && errors.name}
                  />

                  <Field
                    as={TextField}
                    label="Hotline"
                    name="hotline"
                    type="tel"
                    placeholder="Enter hotline number"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                    error={touched.hotline && errors.hotline}
                    helperText={touched.hotline && errors.hotline}
                  />

                  <Field
                    as={TextField}
                    label="Website"
                    name="website"
                    type="url"
                    placeholder="Enter company website"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WebsiteIcon />
                        </InputAdornment>
                      ),
                    }}
                    error={touched.website && errors.website}
                    helperText={touched.website && errors.website}
                  />

                  <Field
                    as={TextField}
                    label="Founded Year"
                    name="founded_year"
                    type="date"
                    placeholder="Enter founded year"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateIcon />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={touched.founded_year && errors.founded_year}
                    helperText={touched.founded_year && errors.founded_year}
                  />
                </div>

                {/* Description TextField with Full Width */}
                <div className="my-8">
                  <Field
                    as={TextField}
                    label="Description"
                    name="description"
                    placeholder="Enter company description"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={6}
                    error={touched.description && errors.description}
                    helperText={touched.description && errors.description}
                  />
                </div>

                {/* Save Information Button */}
                <DialogActions>
                  <Button onClick={onClose}>Cancel</Button>
                  <AuthButton
                    label="Save Information"
                    type="submit"
                    className="w-auto"
                    disabled={isSubmitting}
                  />
                </DialogActions>
              </Form>
            )}
          </Formik>
        </div>
      </DialogContent>
    </>
  );
};

export default Company;
