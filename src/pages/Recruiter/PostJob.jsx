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
import { useNavigate } from "react-router-dom";

const initialValues = {
  job_type: "",
  title: "",
  description: "",
  skill_required: "",
  benefits: "",
  location: "",
  specific_address: "",
  salary_range: "",
  level: "",
  minimum_years_of_experience: "",
  role_and_responsibilities: "",
  contract_type: "",
  interview_process: "",
  expired_at: "",
};

const jobSchema = yup.object().shape({
  job_type: yup.string().required("Required"),
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
  skill_required: yup.string().required("Required"),
  benefits: yup.string().required("Required"),
  location: yup.string().required("Required"),
  specific_address: yup.string().required("Required"),
  salary_range: yup.string().required("Required"),
  level: yup.string().required("Required"),
  minimum_years_of_experience: yup.string().required("Required"),
  role_and_responsibilities: yup.string().required("Required"),
  contract_type: yup.string().required("Required"),
  interview_process: yup.string().required("Required"),
  expired_at: yup
    .date()
    .min(new Date(), "Expiration date must be in the future")
    .required("Required")
    .transform((value, originalValue) => {
      if (originalValue) {
        return new Date(originalValue);
      }
      return value;
    }),
});

const levels = ["Entry", "Junior", "Middle", "Senior", "Lead"];
const jobTypes = ["Remote", "Onsite", "Hybrid"];
const contractTypes = ["Full time", "Part time", "Freelance", "Internship"];
const experienceRanges = ["0-1 year", "1-2 years", "2-5 years", "5+ years"];

const PostJob = ({ rejectedJob }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const getInitialValues = () => {
    if (rejectedJob) {
      return {
        job_type: rejectedJob.job_type || "",
        title: rejectedJob.title || "",
        description: rejectedJob.description || "",
        skill_required: rejectedJob.skill_required || "",
        benefits: rejectedJob.benefits || "",
        location: rejectedJob.location || "",
        specific_address: rejectedJob.specific_address || "",
        salary_range: rejectedJob.salary_range || "",
        level: rejectedJob.level || "",
        minimum_years_of_experience: rejectedJob.minimum_years_of_experience || "",
        role_and_responsibilities: rejectedJob.role_and_responsibilities || "",
        contract_type: rejectedJob.contract_type || "",
        interview_process: rejectedJob.interview_process || "",
        expired_at: rejectedJob.expired_at ? rejectedJob.expired_at.split('T')[0] : "",
      };
    }
    return initialValues;
  };

  const handleFormSubmit = async (values, { setSubmitting, setStatus }) => {
    console.log("Original values:", values);

    const formattedValues = {
      ...values,
      expired_at: `${values.expired_at}T23:59:59`
    };

    console.log("Formatted values:", formattedValues);
    console.log("Formatted expired_at:", formattedValues.expired_at);

    const apiURL = process.env.REACT_APP_API_URL + "/job/add_and_post_job/";
    const accessToken = Cookies.get("access_token");

    try {
      const res = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formattedValues),
      });

      const data = await res.json();

      if (res.status === 201) {
        setStatus({ success: "Job posted successfully!" });
        if (rejectedJob) {
          setTimeout(() => {
            navigate("/recruiter/manage-jobs");
          }, 2000);
        }
      } else {
        let errorMessage = "";
        if (data.detail) {
          errorMessage = `Authentication error: ${data.detail}`;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === "object") {
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
        setStatus({ error: errorMessage });
      }
    } catch (error) {
      setStatus({
        error: "Network error or invalid response format. Please check your connection and try again.",
      });
    }

    setSubmitting(false);
  };

  return (
    <Box m="20px">
      <Header 
        title={rejectedJob ? "REPOST JOB" : "POST JOB"} 
        subtitle={rejectedJob ? "Repost Rejected Job" : "Create a New Job Posting"} 
      />
      <Paper elevation={3} sx={{ p: 4, mt: 4, backgroundColor: colors.primary[400] }}>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={getInitialValues()}
          validationSchema={jobSchema}
        >
          {({ errors, touched, values, status }) => (
            <Form>
              <Box display="flex" flexDirection="column" gap={3}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Job Details
                </Typography>
                <Divider sx={{ borderBottomWidth: 3, borderColor: colors.grey[100] }} />
                
                {/* Job Type and Title */}
                <Box display="flex" flexDirection={isNonMobile ? "row" : "column"} gap={3}>
                  <Field
                    as={TextField}
                    fullWidth
                    select
                    variant="filled"
                    label="Job Type"
                    name="job_type"
                    error={touched.job_type && errors.job_type}
                    helperText={touched.job_type && errors.job_type}
                  >
                    {jobTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
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

                {/* Description */}
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

                {/* Skills and Benefits */}
                <Box display="flex" flexDirection={isNonMobile ? "row" : "column"} gap={3}>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    label="Required Skills"
                    name="skill_required"
                    error={touched.skill_required && errors.skill_required}
                    helperText={touched.skill_required && errors.skill_required}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    label="Benefits"
                    name="benefits"
                    error={touched.benefits && errors.benefits}
                    helperText={touched.benefits && errors.benefits}
                  />
                </Box>

                {/* Location and Address */}
                <Box display="flex" flexDirection={isNonMobile ? "row" : "column"} gap={3}>
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
                    fullWidth
                    variant="filled"
                    label="Specific Address"
                    name="specific_address"
                    error={touched.specific_address && errors.specific_address}
                    helperText={touched.specific_address && errors.specific_address}
                  />
                </Box>

                {/* Level and Experience */}
                <Box display="flex" flexDirection={isNonMobile ? "row" : "column"} gap={3}>
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
                  <Field
                    as={TextField}
                    select
                    fullWidth
                    variant="filled"
                    label="Years of Experience"
                    name="minimum_years_of_experience"
                    error={touched.minimum_years_of_experience && errors.minimum_years_of_experience}
                    helperText={touched.minimum_years_of_experience && errors.minimum_years_of_experience}
                  >
                    {experienceRanges.map((range) => (
                      <MenuItem key={range} value={range}>
                        {range}
                      </MenuItem>
                    ))}
                  </Field>
                </Box>

                {/* Role and Responsibilities */}
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  label="Role and Responsibilities"
                  name="role_and_responsibilities"
                  multiline
                  rows={3}
                  error={touched.role_and_responsibilities && errors.role_and_responsibilities}
                  helperText={touched.role_and_responsibilities && errors.role_and_responsibilities}
                />

                {/* Contract Type */}
                <Field
                  as={TextField}
                  select
                  fullWidth
                  variant="filled"
                  label="Contract Type"
                  name="contract_type"
                  error={touched.contract_type && errors.contract_type}
                  helperText={touched.contract_type && errors.contract_type}
                >
                  {contractTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Field>

                {/* Salary Range */}
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  label="Salary Range"
                  name="salary_range"
                  error={touched.salary_range && errors.salary_range}
                  helperText={touched.salary_range && errors.salary_range}
                />

                {/* Interview Process */}
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  label="Interview Process"
                  name="interview_process"
                  multiline
                  rows={3}
                  error={touched.interview_process && errors.interview_process}
                  helperText={touched.interview_process && errors.interview_process}
                />

                {/* Expiration Date */}
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  type="date"
                  label="Expiration Date"
                  name="expired_at"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: new Date().toISOString().split('T')[0]
                  }}
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
