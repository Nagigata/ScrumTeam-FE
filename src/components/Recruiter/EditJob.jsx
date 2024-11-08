import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Paper,
  Typography,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "./Header";
import Cookies from "js-cookie";
import { tokens } from "../../theme";
import EditIcon from "@mui/icons-material/Edit";

const levels = ["Entry", "Junior", "Middle", "Senior", "Lead"];
const jobTypes = ["Remote", "Onsite", "Hybrid"];
const contractTypes = ["Full time", "Part time", "Freelance", "Internship"];
const experienceRanges = ["0-1 year", "1-2 years", "2-5 years", "5+ years"];

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

const EditJob = ({ open, onClose, job }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [jobTypes, setJobTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [yearExps, setYearExps] = useState([]);
  const [levels, setLevels] = useState([]);
  const [skills, setSkills] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAllOptions();
  }, []);

  const fetchAllOptions = async () => {
    try {
      const [jobTypesRes, locationsRes, salaryRangesRes, yearExpsRes, levelsRes, skillsRes, contractTypesRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/options/get_all_job_types/`),
        fetch('https://provinces.open-api.vn/api/'),
        fetch(`${process.env.REACT_APP_API_URL}/options/get_all_salary_ranges/`),
        fetch(`${process.env.REACT_APP_API_URL}/options/get_all_years_of_experience/`),
        fetch(`${process.env.REACT_APP_API_URL}/options/get_all_levels/`),
        fetch(`${process.env.REACT_APP_API_URL}/options/get_all_skills/`),
        fetch(`${process.env.REACT_APP_API_URL}/options/get_all_contract_types/`)
      ]);

      const [jobTypes, locations, salaryRanges, yearExps, levels, skills, contractTypes] = await Promise.all([
        jobTypesRes.json(),
        locationsRes.json(),
        salaryRangesRes.json(),
        yearExpsRes.json(),
        levelsRes.json(),
        skillsRes.json(),
        contractTypesRes.json()
      ]);

      setJobTypes(jobTypes);
      setLocations(locations);
      setSalaryRanges(salaryRanges);
      setYearExps(yearExps);
      setLevels(levels);
      setSkills(skills);
      setContractTypes(contractTypes);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  if (!open) return null;

  const handleFormSubmit = async (values, { setSubmitting, setStatus }) => {
    const formatDateTime = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 19);
    };

    const formattedValues = {
      job_id: job.id,
      job_type: values.job_type,
      title: values.title,
      description: values.description,
      skill_required: values.skill_required,
      benefits: values.benefits,
      location: values.location,
      specific_address: values.specific_address,
      salary_range: values.salary_range,
      level: values.level,
      minimum_years_of_experience: values.minimum_years_of_experience,
      role_and_responsibilities: values.role_and_responsibilities,
      contract_type: values.contract_type,
      interview_process: values.interview_process,
      expired_at: formatDateTime(values.expired_at)
    };

    console.log('Formatted values:', formattedValues);

    const apiURL = "http://cnpm.duytech.site/api/job/save_changes_job/";
    const accessToken = Cookies.get("access_token");

    try {
      setStatus(null);
      const res = await fetch(apiURL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formattedValues),
      });

      const data = await res.json();
      console.log('Response:', data);

      if (res.ok) {
        setStatus({ success: "Job updated successfully!" });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        let errorMessage;
        if (typeof data.detail === 'object') {
          errorMessage = Object.entries(data.detail)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('\n');
        } else {
          errorMessage = data.detail || data.message || "Failed to update job";
        }
        setStatus({ error: errorMessage });
      }
    } catch (error) {
      console.error('Error updating job:', error);
      setStatus({
        error: "Network error. Please check your connection and try again.",
      });
    }

    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: colors.primary[400], color: colors.grey[100] }}>
        <Box display="flex" alignItems="center">
          <EditIcon sx={{ mr: 1 }} />
          Edit Job
        </Box>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: colors.primary[400], pt: 2 }}>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={{
            job_type: job?.job_type || "",
            title: job?.title || "",
            description: job?.description || "",
            skill_required: job?.skill_required || "",
            benefits: job?.benefits || "",
            location: job?.location || "",
            specific_address: job?.specific_address || "",
            salary_range: job?.salary_range || "",
            level: job?.level || "",
            minimum_years_of_experience: job?.minimum_years_of_experience || "",
            role_and_responsibilities: job?.role_and_responsibilities || "",
            contract_type: job?.contract_type || "",
            interview_process: job?.interview_process || "",
            expired_at: job?.expired_at ? job.expired_at.split('T')[0] : "",
          }}
          validationSchema={jobSchema}
        >
          {({ errors, touched, values, handleChange, handleSubmit, status }) => (
            <Form id="edit-job-form" onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap="20px">
                {/* Job Type */}
                <Field
                  as={TextField}
                  select
                  label="Job Type"
                  name="job_type"
                  value={values.job_type}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={touched.job_type && errors.job_type}
                  helperText={touched.job_type && errors.job_type}
                >
                  {jobTypes.map((type) => (
                    <MenuItem key={type.id} value={type.job_type}>
                      {type.job_type}
                    </MenuItem>
                  ))}
                </Field>

                {/* Title */}
                <Field
                  as={TextField}
                  label="Job Title"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={touched.title && errors.title}
                  helperText={touched.title && errors.title}
                />

                {/* Description */}
                <Field
                  as={TextField}
                  label="Description"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  required
                  error={touched.description && errors.description}
                  helperText={touched.description && errors.description}
                />

                {/* Skills Required */}
                <Field
                  as={TextField}
                  select
                  label="Skills Required"
                  name="skill_required"
                  value={values.skill_required}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={touched.skill_required && errors.skill_required}
                  helperText={touched.skill_required && errors.skill_required}
                >
                  {skills.map((skill) => (
                    <MenuItem key={skill.id} value={skill.skill}>
                      {skill.skill}
                    </MenuItem>
                  ))}
                </Field>

                {/* Benefits */}
                <Field
                  as={TextField}
                  label="Benefits"
                  name="benefits"
                  value={values.benefits}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  fullWidth
                  required
                  error={touched.benefits && errors.benefits}
                  helperText={touched.benefits && errors.benefits}
                />

                {/* Location and Specific Address */}
                <Box display="flex" gap={2}>
                  <Field
                    as={TextField}
                    select
                    label="Location"
                    name="location"
                    value={values.location}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={touched.location && errors.location}
                    helperText={touched.location && errors.location}
                  >
                    {locations.map((loc) => (
                      <MenuItem key={loc.code} value={loc.name}>
                        {loc.name}
                      </MenuItem>
                    ))}
                  </Field>

                  <Field
                    as={TextField}
                    label="Specific Address"
                    name="specific_address"
                    value={values.specific_address}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={touched.specific_address && errors.specific_address}
                    helperText={touched.specific_address && errors.specific_address}
                  />
                </Box>

                {/* Level and Experience */}
                <Box display="flex" gap={2}>
                  <Field
                    as={TextField}
                    select
                    label="Level"
                    name="level"
                    value={values.level}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={touched.level && errors.level}
                    helperText={touched.level && errors.level}
                  >
                    {levels.map((level) => (
                      <MenuItem key={level.id} value={level.level}>
                        {level.level}
                      </MenuItem>
                    ))}
                  </Field>

                  <Field
                    as={TextField}
                    select
                    label="Minimum Years of Experience"
                    name="minimum_years_of_experience"
                    value={values.minimum_years_of_experience}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={touched.minimum_years_of_experience && errors.minimum_years_of_experience}
                    helperText={touched.minimum_years_of_experience && errors.minimum_years_of_experience}
                  >
                    {yearExps.map((exp) => (
                      <MenuItem key={exp.id} value={exp.yoe}>
                        {exp.yoe}
                      </MenuItem>
                    ))}
                  </Field>
                </Box>

                {/* Contract Type and Salary Range */}
                <Box display="flex" gap={2}>
                  <Field
                    as={TextField}
                    select
                    label="Contract Type"
                    name="contract_type"
                    value={values.contract_type}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={touched.contract_type && errors.contract_type}
                    helperText={touched.contract_type && errors.contract_type}
                  >
                    {contractTypes.map((type) => (
                      <MenuItem key={type.id} value={type.contract_type}>
                        {type.contract_type}
                      </MenuItem>
                    ))}
                  </Field>

                  <Field
                    as={TextField}
                    select
                    label="Salary Range"
                    name="salary_range"
                    value={values.salary_range}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={touched.salary_range && errors.salary_range}
                    helperText={touched.salary_range && errors.salary_range}
                  >
                    {salaryRanges.map((range) => (
                      <MenuItem key={range.id} value={range.salary_range}>
                        {range.salary_range}
                      </MenuItem>
                    ))}
                  </Field>
                </Box>

                {/* Role and Responsibilities */}
                <Field
                  as={TextField}
                  label="Role & Responsibilities"
                  name="role_and_responsibilities"
                  value={values.role_and_responsibilities}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  required
                  error={touched.role_and_responsibilities && errors.role_and_responsibilities}
                  helperText={touched.role_and_responsibilities && errors.role_and_responsibilities}
                />

                {/* Interview Process */}
                <Field
                  as={TextField}
                  label="Interview Process"
                  name="interview_process"
                  value={values.interview_process}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  required
                  error={touched.interview_process && errors.interview_process}
                  helperText={touched.interview_process && errors.interview_process}
                />

                {/* Expiration Date */}
                <Field
                  as={TextField}
                  label="Expiration Date"
                  name="expired_at"
                  type="datetime-local"
                  value={values.expired_at}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={touched.expired_at && errors.expired_at}
                  helperText={touched.expired_at && errors.expired_at}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: "1",
                    min: new Date().toISOString().slice(0, 16)
                  }}
                />

                {/* Status messages */}
                {status && status.error && (
                  <Box 
                    sx={{ 
                      color: 'error.main',
                      bgcolor: 'error.light',
                      p: 2,
                      borderRadius: 1,
                      mt: 2 
                    }}
                  >
                    {status.error}
                  </Box>
                )}
                {status && status.success && (
                  <Box 
                    sx={{ 
                      color: 'success.main',
                      bgcolor: 'success.light',
                      p: 2,
                      borderRadius: 1,
                      mt: 2 
                    }}
                  >
                    {status.success}
                  </Box>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: colors.primary[400] }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: colors.grey[100],
            borderColor: colors.grey[400],
            "&:hover": {
              borderColor: colors.grey[600],
              bgcolor: colors.grey[700],
            },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="edit-job-form"
          variant="contained"
          startIcon={<EditIcon />}
          sx={{
            color: colors.grey[10],
            bgcolor: colors.primary[600],
            "&:hover": {
              bgcolor: colors.primary[700],
            },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditJob;