import {
  Box,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Recruiter/Header";

const initialValues = {
  jobTitle: "",
  jobType: "",
  jobLevel: "",
  jobDescription: "",
  workLocation: "",
  applicationStartDate: "",
  applicationEndDate: "",
  salary: "",
};

const jobSchema = yup.object().shape({
  jobTitle: yup.string().required("Required"),
  jobType: yup.string().required("Required"),
  jobLevel: yup.string().required("Required"),
  jobDescription: yup.string().required("Required"),
  workLocation: yup.string().required("Required"),
  applicationStartDate: yup.date().required("Required"),
  applicationEndDate: yup
    .date()
    .min(yup.ref("applicationStartDate"), "End date must be after start date")
    .required("Required"),
  salary: yup
    .number()
    .positive("Must be a positive number")
    .required("Required"),
});

const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
];

const jobLevels = [
  "Entry Level",
  "Junior",
  "Mid-Level",
  "Senior",
  "Lead",
  "Manager",
  "Executive",
];

const PostJob = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log(values);
    // Here you would typically send the data to your backend
  };

  return (
    <Box m="20px">
      <Header title="POST JOB" subtitle="Create a New Job Posting" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={jobSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Job Title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.jobTitle}
                name="jobTitle"
                error={!!touched.jobTitle && !!errors.jobTitle}
                helperText={touched.jobTitle && errors.jobTitle}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                select
                label="Job Type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.jobType}
                name="jobType"
                error={!!touched.jobType && !!errors.jobType}
                helperText={touched.jobType && errors.jobType}
                sx={{ gridColumn: "span 2" }}
              >
                {jobTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                variant="filled"
                select
                label="Job Level"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.jobLevel}
                name="jobLevel"
                error={!!touched.jobLevel && !!errors.jobLevel}
                helperText={touched.jobLevel && errors.jobLevel}
                sx={{ gridColumn: "span 2" }}
              >
                {jobLevels.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Work Location"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.workLocation}
                name="workLocation"
                error={!!touched.workLocation && !!errors.workLocation}
                helperText={touched.workLocation && errors.workLocation}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Salary"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.salary}
                name="salary"
                error={!!touched.salary && !!errors.salary}
                helperText={touched.salary && errors.salary}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                inputProps={{
                  step: 100,
                }}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Job Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.jobDescription}
                name="jobDescription"
                error={!!touched.jobDescription && !!errors.jobDescription}
                helperText={touched.jobDescription && errors.jobDescription}
                multiline
                rows={4}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Application Start Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.applicationStartDate}
                name="applicationStartDate"
                error={
                  !!touched.applicationStartDate &&
                  !!errors.applicationStartDate
                }
                helperText={
                  touched.applicationStartDate && errors.applicationStartDate
                }
                InputLabelProps={{ shrink: true }}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Application End Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.applicationEndDate}
                name="applicationEndDate"
                error={
                  !!touched.applicationEndDate && !!errors.applicationEndDate
                }
                helperText={
                  touched.applicationEndDate && errors.applicationEndDate
                }
                InputLabelProps={{ shrink: true }}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Post Job
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default PostJob;
