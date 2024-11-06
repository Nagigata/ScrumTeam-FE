import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

const levels = ["Entry", "Junior", "Middle", "Senior", "Lead"];
const statusOptions = ["Active", "Inactive", "Draft"];

const EditJob = ({ open, onClose, onSave, job }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [editedJob, setEditedJob] = useState({
    job_category: "",
    title: "",
    description: "",
    skill_required: "",
    benefits: "",
    location: "",
    salary_range: "",
    status: "Draft", // Default to Draft
    level: "",
    experience: "",
    interview_process: "",
    expired_at: "", // Added expired_at field
  });

  const [errors, setErrors] = useState({});
  const [jobCategories, setJobCategories] = useState([]);

  useEffect(() => {
    if (job) {
      setEditedJob({
        ...job,
        status: job.status || "Draft", // Ensure status is one of the three options
        expired_at:
          job.expired_at ||
          formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // Default to 30 days from now
      });
    }
    fetchJobCategories();
  }, [job]);

  // Helper function to format date for expired_at
  const formatDate = (date) => {
    return date.toISOString().split("T")[0] + "T23:59:59";
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedJob((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!editedJob.job_category)
      newErrors.job_category = "Job category is required";
    if (!editedJob.title) newErrors.title = "Title is required";
    if (!editedJob.skill_required)
      newErrors.skill_required = "Skills required is required";
    if (!editedJob.benefits) newErrors.benefits = "Benefits is required";
    if (!editedJob.location) newErrors.location = "Location is required";
    if (!editedJob.salary_range)
      newErrors.salary_range = "Salary range is required";
    if (!editedJob.level) newErrors.level = "Level is required";
    if (!editedJob.status) newErrors.status = "Status is required";
    if (!editedJob.expired_at)
      newErrors.expired_at = "Expiration date is required";

    // Validate salary range format
    const salaryRangeRegex = /^\d+-\d+\s+USD$/;
    if (!salaryRangeRegex.test(editedJob.salary_range)) {
      newErrors.salary_range =
        "Salary range must be in the format 'min-max USD'";
    } else {
      const [min, max] = editedJob.salary_range
        .split("-")
        .map((s) => parseInt(s));
      if (min >= max) {
        newErrors.salary_range =
          "Maximum salary must be greater than minimum salary";
      }
    }

    // Validate expiration date
    if (editedJob.expired_at) {
      const expireDate = new Date(editedJob.expired_at);
      const now = new Date();
      if (expireDate <= now) {
        newErrors.expired_at = "Expiration date must be in the future";
      }
    }

    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSave(editedJob);
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: colors.primary[400],
          color: colors.grey[100],
          display: "flex",
          alignItems: "center",
        }}
      >
        <EditIcon sx={{ mr: 1 }} />
        Edit Job
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap="20px" mt="20px">
          <TextField
            select
            label="Job Category"
            name="job_category"
            value={editedJob.job_category}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.job_category}
            helperText={errors.job_category}
          >
            {jobCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Title"
            name="title"
            value={editedJob.title}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.title}
            helperText={errors.title}
          />
          {/* 
          <TextField
            label="Description"
            name="description"
            value={editedJob.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            required
            error={!!errors.description}
            helperText={errors.description}
          /> */}

          <TextField
            label="Skills Required"
            name="skill_required"
            value={editedJob.skill_required}
            onChange={handleChange}
            fullWidth
            multiline
            required
            error={!!errors.skill_required}
            helperText={errors.skill_required}
          />

          <TextField
            label="Benefits"
            name="benefits"
            value={editedJob.benefits}
            onChange={handleChange}
            fullWidth
            multiline
            required
            error={!!errors.benefits}
            helperText={errors.benefits}
          />

          <TextField
            label="Location"
            name="location"
            value={editedJob.location}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.location}
            helperText={errors.location}
          />

          <TextField
            label="Salary Range"
            name="salary_range"
            value={editedJob.salary_range}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.salary_range}
            helperText={
              errors.salary_range ||
              "Format: min-max USD (e.g., 50000-70000 USD)"
            }
          />

          <TextField
            select
            label="Status"
            name="status"
            value={editedJob.status}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.status}
            helperText={errors.status}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Level"
            name="level"
            value={editedJob.level}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.level}
            helperText={errors.level}
          >
            {levels.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          {/* <TextField
            label="Experience"
            name="experience"
            value={editedJob.experience}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.experience}
            helperText={errors.experience}
          /> */}

          {/* <TextField
            label="Interview Process"
            name="interview_process"
            value={editedJob.interview_process}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            required
            error={!!errors.interview_process}
            helperText={errors.interview_process}
          /> */}

          <TextField
            label="Expiration Date"
            name="expired_at"
            type="datetime-local"
            value={
              editedJob.expired_at ? editedJob.expired_at.slice(0, 16) : ""
            } // Format for datetime-local input
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.expired_at}
            helperText={errors.expired_at}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: colors.primary[400] }}>
        <Button
          onClick={handleClose}
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
          onClick={handleSave}
          variant="contained"
          startIcon={<EditIcon />}
          color="primary"
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditJob;
