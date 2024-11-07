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
  Typography,
  Divider,
} from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import Cookies from "js-cookie";

const RepostJob = ({ open, onClose, onSave, job, handleHide }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [jobData, setJobData] = useState({
    job_type: "",
    title: "",
    description: "",
    skill_required: "",
    benefits: "",
    location: "",
    role: "",
    salary_range: "",
    minimum_year_of_exp: "",
    level: "",
    experience: "",
    interview_process: "",
    expired_at: "",
    contract_type: "",
    specific_address: ""
  });

  const [errors, setErrors] = useState({});
  const [jobTypes, setJobTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [yearExps, setYearExps] = useState([]);
  const [levels, setLevels] = useState([]);
  const [skills, setSkills] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);

  useEffect(() => {
    if (job) {
      setJobData({
        ...job,
        expired_at: job.expired_at || formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
      });
    }
    fetchAllOptions();
  }, [job]);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0] + "T23:59:59";
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    // Add your validation logic here
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const apiURL = process.env.REACT_APP_API_URL + "/job/add_and_post_job/";
    const accessToken = Cookies.get("access_token");

    // Chuẩn bị dữ liệu để gửi
    const formattedData = {
      job_type: jobData.job_type,
      title: jobData.title,
      description: jobData.description,
      skill_required: jobData.skill_required,
      benefits: jobData.benefits,
      location: jobData.location,
      specific_address: jobData.specific_address,
      salary_range: jobData.salary_range,
      level: jobData.level,
      minimum_years_of_experience: jobData.minimum_years_of_experience,
      role_and_responsibilities: jobData.role_and_responsibilities,
      contract_type: jobData.contract_type,
      interview_process: jobData.interview_process,
      expired_at: jobData.expired_at
    };

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (response.ok) {
        // Nếu repost thành công
        if (handleHide && job.id) {
          handleHide(job.id); // Ẩn job cũ
        }
        onSave(data); // Callback để cập nhật UI
        onClose(); // Đóng dialog
      } else {
        // Xử lý lỗi
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
          errorMessage = "An unknown error occurred while reposting the job.";
        }
        setErrors({ submit: errorMessage });
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrors({ submit: "Network error. Please check your connection." });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: colors.primary[400], color: colors.grey[100] }}>
        <Box display="flex" alignItems="center">
          <ReplayIcon sx={{ mr: 1 }} />
          Repost Job
        </Box>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: colors.primary[400], pt: 2 }}>
        <Box display="flex" flexDirection="column" gap="20px">
          {/* Job Type */}
          <TextField
            select
            label="Job Type"
            name="job_type"
            value={jobData.job_type}
            onChange={handleChange}
            fullWidth
            required
          >
            {jobTypes.map((type) => (
              <MenuItem key={type.id} value={type.job_type}>
                {type.job_type}
              </MenuItem>
            ))}
          </TextField>

          {/* Title */}
          <TextField
            label="Job Title"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Description */}
          <TextField
            label="Description"
            name="description"
            value={jobData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            required
          />

          {/* Skills Required */}
          <TextField
            select
            label="Skills Required"
            name="skill_required"
            value={jobData.skill_required}
            onChange={handleChange}
            fullWidth
            required
          >
            {skills.map((skill) => (
              <MenuItem key={skill.id} value={skill.skill}>
                {skill.skill}
              </MenuItem>
            ))}
          </TextField>

          {/* Benefits */}
          <TextField
            label="Benefits"
            name="benefits"
            value={jobData.benefits}
            onChange={handleChange}
            multiline
            rows={2}
            fullWidth
            required
          />

          {/* Location and Specific Address */}
          <Box display="flex" gap={2}>
            <TextField
              select
              label="Location"
              name="location"
              value={jobData.location}
              onChange={handleChange}
              fullWidth
              required
            >
              {locations.map((loc) => (
                <MenuItem key={loc.code} value={loc.name}>
                  {loc.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Specific Address"
              name="specific_address"
              value={jobData.specific_address}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>

          {/* Level and Experience */}
          <Box display="flex" gap={2}>
            <TextField
              select
              label="Level"
              name="level"
              value={jobData.level}
              onChange={handleChange}
              fullWidth
              required
            >
              {levels.map((level) => (
                <MenuItem key={level.id} value={level.level}>
                  {level.level}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Minimum Years of Experience"
              name="minimum_years_of_experience"
              value={jobData.minimum_years_of_experience}
              onChange={handleChange}
              fullWidth
              required
            >
              {yearExps.map((exp) => (
                <MenuItem key={exp.id} value={exp.yoe}>
                  {exp.yoe}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Contract Type and Salary Range */}
          <Box display="flex" gap={2}>
            <TextField
              select
              label="Contract Type"
              name="contract_type"
              value={jobData.contract_type}
              onChange={handleChange}
              fullWidth
              required
            >
              {contractTypes.map((type) => (
                <MenuItem key={type.id} value={type.contract_type}>
                  {type.contract_type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Salary Range"
              name="salary_range"
              value={jobData.salary_range}
              onChange={handleChange}
              fullWidth
              required
            >
              {salaryRanges.map((range) => (
                <MenuItem key={range.id} value={range.salary_range}>
                  {range.salary_range}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Role and Responsibilities */}
          <TextField
            label="Role & Responsibilities"
            name="role_and_responsibilities"
            value={jobData.role_and_responsibilities}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            required
          />

          {/* Interview Process */}
          <TextField
            label="Interview Process"
            name="interview_process"
            value={jobData.interview_process}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            required
          />

          {/* Expiration Date */}
          <TextField
            label="Expiration Date"
            name="expired_at"
            type="datetime-local"
            value={jobData.expired_at ? jobData.expired_at.slice(0, 16) : ""}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: new Date().toISOString().slice(0, 16)
            }}
          />

          {errors.submit && (
            <Typography color="error" textAlign="center">
              {errors.submit}
            </Typography>
          )}
        </Box>
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
          onClick={handleSave}
          variant="contained"
          startIcon={<ReplayIcon />}
          color="primary"
        >
          Repost Job
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RepostJob;