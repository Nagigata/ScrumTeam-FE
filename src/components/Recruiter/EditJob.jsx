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
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

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

const EditJob = ({ open, onClose, onSave, job }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [editedJob, setEditedJob] = useState({
    title: "",
    type: "",
    level: "",
    location: "",
    salary: 0,
    applicationStartDate: "",
    applicationEndDate: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (job) {
      setEditedJob(job);
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedJob((prevJob) => ({
      ...prevJob,
      [name]: name === "salary" ? Number(value) : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!editedJob.title) newErrors.title = "Title is required";
    if (!editedJob.location) newErrors.location = "Location is required";
    if (!editedJob.description)
      newErrors.description = "Description is required";
    if (editedJob.salary <= 0) {
      newErrors.salary = "Salary must be a positive number";
    }
    if (
      new Date(editedJob.applicationEndDate) <
      new Date(editedJob.applicationStartDate)
    ) {
      newErrors.applicationEndDate = "End date must be after start date";
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
            label="Title"
            name="title"
            value={editedJob.title}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            label="Type"
            name="type"
            value={editedJob.type}
            onChange={handleChange}
            fullWidth
            select
            required
            error={!!errors.type}
            helperText={errors.type}
          >
            {jobTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Level"
            name="level"
            value={editedJob.level}
            onChange={handleChange}
            fullWidth
            select
            required
            error={!!errors.level}
            helperText={errors.level}
          >
            {jobLevels.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
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
            label="Salary"
            name="salary"
            type="number"
            value={editedJob.salary}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            inputProps={{ step: 100 }}
            error={!!errors.salary}
            helperText={errors.salary}
          />
          <TextField
            label="Application Start Date"
            name="applicationStartDate"
            type="date"
            value={editedJob.applicationStartDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
            error={!!errors.applicationStartDate}
            helperText={errors.applicationStartDate}
          />
          <TextField
            label="Application End Date"
            name="applicationEndDate"
            type="date"
            value={editedJob.applicationEndDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
            error={!!errors.applicationEndDate}
            helperText={errors.applicationEndDate}
          />
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
