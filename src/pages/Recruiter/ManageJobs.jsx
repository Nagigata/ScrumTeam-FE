import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, IconButton, Tooltip } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Recruiter/Header";
import DeleteJob from "../../components/Recruiter/DeleteJob";
import EditJob from "../../components/Recruiter/EditJob";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const mockJobs = [
  {
    id: 1,
    title: "Software Engineer",
    type: "Full-time",
    level: "Mid-Level",
    location: "New York",
    salary: 95000,
    applicationStartDate: "2024-05-15",
    applicationEndDate: "2024-06-15",
    description:
      "We are seeking a talented Software Engineer to join our team...",
  },
  {
    id: 2,
    title: "Data Analyst",
    type: "Part-time",
    level: "Junior",
    location: "Remote",
    salary: 65000,
    applicationStartDate: "2024-06-01",
    applicationEndDate: "2024-07-01",
    description:
      "Join our data team to help analyze and interpret complex data sets...",
  },
  {
    id: 3,
    title: "UX Designer",
    type: "Contract",
    level: "Senior",
    location: "San Francisco",
    salary: 110000,
    applicationStartDate: "2024-05-20",
    applicationEndDate: "2024-06-20",
    description:
      "We're looking for an experienced UX Designer to create intuitive and engaging user experiences...",
  },
];

const ManageJobs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setJobs(mockJobs);
  }, []);

  const handleEdit = (job) => {
    setSelectedJob(job);
    setIsEditDialogOpen(true);
  };

  const handleSaveJob = (updatedJob) => {
    setJobs(jobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
    setIsEditDialogOpen(false);
    setSelectedJob(null);
  };

  const handleDelete = (job) => {
    setSelectedJob(job);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteJob = (jobId, reason) => {
    setJobs(jobs.filter((job) => job.id !== jobId));
    setIsDeleteDialogOpen(false);
    setSelectedJob(null);
    console.log(`Job ${jobId} deleted. Reason: ${reason}`);
  };

  return (
    <Box m="20px">
      <Header title="MANAGE JOBS" subtitle="View and Manage Job Listings" />

      <Box mt="40px">
        <Typography
          variant="h4"
          color={colors.grey[100]}
          fontWeight="bold"
          mb="15px"
        >
          Current Job Listings
        </Typography>
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap="20px"
        >
          {jobs.map((job) => (
            <Box
              key={job.id}
              backgroundColor={colors.primary[400]}
              borderRadius="4px"
              p="15px"
            >
              <Typography
                variant="h5"
                color={colors.grey[100]}
                fontWeight="bold"
              >
                {job.title}
              </Typography>
              <Typography variant="body1" color={colors.grey[200]}>
                {job.type} - {job.level}
              </Typography>
              <Typography variant="body2" color={colors.grey[300]}>
                Location: {job.location}
              </Typography>
              <Typography variant="body2" color={colors.grey[300]}>
                Salary: ${job.salary.toLocaleString()}
              </Typography>
              <Typography variant="body2" color={colors.grey[300]}>
                Application Period: {job.applicationStartDate} to{" "}
                {job.applicationEndDate}
              </Typography>
              <Tooltip title={job.description}>
                <Typography
                  variant="body2"
                  color={colors.grey[300]}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {job.description}
                </Typography>
              </Tooltip>
              <Box mt="10px" display="flex" justifyContent="flex-end">
                <IconButton onClick={() => handleEdit(job)} color="secondary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(job)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <EditJob
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedJob(null);
        }}
        onSave={handleSaveJob}
        job={selectedJob}
      />

      <DeleteJob
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedJob(null);
        }}
        onDelete={handleDeleteJob}
        job={selectedJob}
      />
    </Box>
  );
};

export default ManageJobs;
