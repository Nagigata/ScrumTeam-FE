import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Paper,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Recruiter/Header";
import Cookies from "js-cookie";
import { tokens } from "../../theme";
import { title } from "framer-motion/client";

const initialValues = {
  job_category: "",
  title: "",
  description: "",
  skill_required: "",
  benefits: "",
  location: "",
  min_salary: "",
  max_salary: "",
  status: "Draft",
  level: "",
  experience: "",
  interview_process: "",
  expired_at: "",
};

const jobSchema = yup.object().shape({
  job_category: yup.string().required("Required"),
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
  skill_required: yup.string().required("Required"),
  benefits: yup.string().required("Required"),
  location: yup.string().required("Required"),
  min_salary: yup
    .number()
    .positive("Minimum salary must be a positive number")
    .required("Required"),
  max_salary: yup
    .number()
    .positive("Maximum salary must be a positive number")
    .test(
      "is-greater-than-min",
      "Maximum salary must be greater than minimum salary",
      function (value) {
        return value > this.parent.min_salary;
      }
    )
    .required("Required"),
  status: yup
    .string()
    .oneOf(["Active", "Inactive", "Draft"])
    .required("Required"),
  level: yup.string().required("Required"),
  experience: yup.string().required("Required"),
  interview_process: yup.string().required("Required"),
  expired_at: yup
    .date()
    .min(new Date(), "Expiration date must be in the future")
    .required("Required"),
});

const levels = ["Entry", "Junior", "Middle", "Senior", "Lead"];
const statusOptions = ["Active", "Inactive", "Draft"];

const PostJob = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [jobCategories, setJobCategories] = useState([]);

  useEffect(() => {
    fetchJobCategories();
  }, []);

  const fetchJobCategories = async () => {
    const apiURL =
      process.env.REACT_APP_API_URL + "/job/get-all-job-categories/";
    try {
      const res = await fetch(apiURL, {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch job categories");
      }
      const data = await res.json();
      setJobCategories(data);
    } catch (error) {
      console.error("Error fetching job categories:", error);
    }
  };

  const handleFormSubmit = async (values, { setSubmitting, setStatus }) => {
    const apiURL = process.env.REACT_APP_API_URL + "/job/post-recruitment/";
    const accessToken = Cookies.get("access_token");
    const confirmValues = {
      ...values,
      expired_at: `${values.expired_at}${":00"}`,
      salary_range: `${values.min_salary}-${values.max_salary} USD`,
    };
    delete confirmValues.min_salary;
    delete confirmValues.max_salary;

    console.log(confirmValues);
    try {
      const res = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(confirmValues),
      });

      const data = await res.json();

      if (res.status === 201) {
        setStatus({ success: "Job posted successfully!" });
      } else {
        // Xử lý các loại lỗi khác nhau
        let errorMessage = "";

        if (data.detail) {
          // Lỗi authentication/authorization
          errorMessage = `Authentication error: ${data.detail}`;
        } else if (data.message) {
          // Lỗi business logic từ API
          errorMessage = data.message;
        } else if (typeof data === "object") {
          // Lỗi validation từ API
          errorMessage = Object.entries(data)
            .map(([field, errors]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(", ")}`;
              }
              return `${field}: ${errors}`;
            })
            .join("\n");
        } else {
          errorMessage = "An unknown error occurred while posting the job.";
        }

        console.error("Error details:", errorMessage);
        setStatus({ error: errorMessage });
      }
    } catch (error) {
      console.error("Network or parsing error:", error);
      setStatus({
        error:
          "Network error or invalid response format. Please check your connection and try again.",
      });
    }

    setSubmitting(false);
  };

  return (
    <Box m="20px">
      <Header title="POST JOB" subtitle="Create a New Job Posting" />
      <Paper
        elevation={3}
        sx={{ p: 4, mt: 4, backgroundColor: colors.primary[400] }}
      >
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={jobSchema}
        >
          {({ errors, touched, values, status, handleChange }) => (
            <Form>
              <Box display="flex" flexDirection="column" gap={3}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Job Details
                </Typography>
                <Divider
                  sx={{
                    borderBottomWidth: 3,
                    borderColor: colors.grey[100],
                  }}
                />
                <Box
                  display="flex"
                  flexDirection={isNonMobile ? "row" : "column"}
                  gap={3}
                >
                  <Field
                    as={TextField}
                    fullWidth
                    select
                    variant="filled"
                    label="Job Category"
                    name="job_category"
                    error={touched.job_category && errors.job_category}
                    helperText={touched.job_category && errors.job_category}
                  >
                    {jobCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.title}
                      </MenuItem>
                    ))}
                  </Field>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    label="Job Title"
                    name="title"
                    error={touched.title && errors.title}
                    helperText={touched.title && errors.title}
                  />
                </Box>
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  error={touched.description && errors.description}
                  helperText={touched.description && errors.description}
                />
                <Box
                  display="flex"
                  flexDirection={isNonMobile ? "row" : "column"}
                  gap={3}
                >
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    label="Skills Required"
                    name="skill_required"
                    multiline
                    error={touched.skill_required && errors.skill_required}
                    helperText={touched.skill_required && errors.skill_required}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    label="Benefits"
                    name="benefits"
                    multiline
                    error={touched.benefits && errors.benefits}
                    helperText={touched.benefits && errors.benefits}
                  />
                </Box>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Job Requirements
                </Typography>
                <Divider
                  sx={{
                    borderBottomWidth: 3,
                    borderColor: colors.grey[100],
                  }}
                />
                <Box
                  display="flex"
                  flexDirection={isNonMobile ? "row" : "column"}
                  gap={3}
                >
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    label="Location"
                    name="location"
                    error={touched.location && errors.location}
                    helperText={touched.location && errors.location}
                  />
                  <Field
                    as={TextField}
                    select
                    fullWidth
                    variant="filled"
                    label="Level"
                    name="level"
                    error={touched.level && errors.level}
                    helperText={touched.level && errors.level}
                  >
                    {levels.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Field>
                </Box>
                <Box
                  display="flex"
                  flexDirection={isNonMobile ? "row" : "column"}
                  gap={3}
                >
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    label="Minimum Salary"
                    name="min_salary"
                    type="number"
                    error={touched.min_salary && errors.min_salary}
                    helperText={touched.min_salary && errors.min_salary}
                    inputProps={{ min: "0" }}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    label="Maximum Salary"
                    name="max_salary"
                    type="number"
                    error={touched.max_salary && errors.max_salary}
                    helperText={touched.max_salary && errors.max_salary}
                    inputProps={{ min: "0" }}
                  />
                </Box>
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  label="Experience"
                  name="experience"
                  error={touched.experience && errors.experience}
                  helperText={touched.experience && errors.experience}
                />
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  label="Interview Process"
                  name="interview_process"
                  multiline
                  rows={3}
                  error={touched.interview_process && errors.interview_process}
                  helperText={
                    touched.interview_process && errors.interview_process
                  }
                />
                <Field
                  as={TextField}
                  fullWidth
                  select
                  variant="filled"
                  label="Status"
                  name="status"
                  error={touched.status && errors.status}
                  helperText={touched.status && errors.status}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  type="datetime-local"
                  label="Expiration Date"
                  name="expired_at"
                  InputLabelProps={{ shrink: true }}
                  error={touched.expired_at && errors.expired_at}
                  helperText={touched.expired_at && errors.expired_at}
                />
              </Box>
              {status && status.error && (
                <Box color="error.main" mt={2} textAlign="center">
                  {status.error}
                </Box>
              )}
              {status && status.success && (
                <Box color="success.main" mt={2} textAlign="center">
                  {status.success}
                </Box>
              )}
              <Box display="flex" justifyContent="center" mt="20px">
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  sx={{
                    width: "200px",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Post Job
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default PostJob;
