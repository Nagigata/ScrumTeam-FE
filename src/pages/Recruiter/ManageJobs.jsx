import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Recruiter/Header";
import EditJob from "../../components/Recruiter/EditJob";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Cookies from "js-cookie";
import { style } from "framer-motion/client";
import { motion } from "framer-motion";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import ApplicationFile from "../../components/Recruiter/ApplicationFile";
const ManageJobs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [showCandidate, setShowCandidate] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [dataDetail, setDataDetail] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const apiURL = process.env.REACT_APP_API_URL + "/job/job-list-of-company/";
    const accessToken = Cookies.get("access_token");

    try {
      const res = await fetch(apiURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(">>> ", res);
      if (res.ok) {
        const data = await res.json();

        setJobs(data);
      } else {
        const errorData = await res.json();
        console.log('Error response from server:', errorData);
        setStatus({
          error: errorData.detail || "Failed to fetch jobs. Please try again.",
        });
      }
    } catch (error) {
      setStatus({ error: "Network error. Please check your connection." });
    }
  };

  const handleEdit = (job) => {
    const jobForEdit = {
      ...job,
      job_category: job.job_category.id,
    };
    setSelectedJob(jobForEdit);
    setIsEditDialogOpen(true);
  };

  const handleUpdatedJob = async (updatedJob) => {
    const apiURL = process.env.REACT_APP_API_URL + "/job/update-recruitment/";
    const accessToken = Cookies.get("access_token");

    try {
      const response = await fetch(apiURL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_id: updatedJob.id,
          job_category: updatedJob.job_category,
          title: updatedJob.title,
          description: updatedJob.description,
          skill_required: updatedJob.skill_required,
          benefits: updatedJob.benefits,
          location: updatedJob.location,
          salary_range: updatedJob.salary_range,
          status: updatedJob.status,
          level: updatedJob.level,
          experience: updatedJob.experience,
          interview_process: updatedJob.interview_process,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus({ success: data.message });
        fetchJobs();
        setIsEditDialogOpen(false);
      } else {
        const errorData = await response.json();
        setStatus({
          error: errorData.message || "Failed to update job. Please try again.",
        });
      }
    } catch (error) {
      setStatus({ error: "Network error. Please check your connection." });
    }
  };

  const handleHide = async (jobId) => {
    const apiURL = process.env.REACT_APP_API_URL + "/job/hide-recruitment/";
    const accessToken = Cookies.get("access_token");

    try {
      const response = await fetch(apiURL, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `job_id=${jobId}`,
      });

      if (response.ok) {
        const data = await response.json();
        setStatus({ success: data.message });
        fetchJobs();
      } else {
        const errorData = await response.json();
        setStatus({
          error: errorData.message || "Failed to hide job. Please try again.",
        });
      }
    } catch (error) {
      setStatus({ error: "Network error. Please check your connection." });
    }
  };

  const handleShowList = (id) => {
    setShowCandidate(!showCandidate);
    fetchCandidates(id);
  };

  const handleOpenShowDetail = (data) => {
    setShowDetail(true);
    setDataDetail(data);
  }

  // -----------------
  const fetchCandidates = async (jobId) => {
    const apiURL = `${process.env.REACT_APP_API_URL}/job/get_list_candidate_applied_for_job/?job_id=${jobId}`;
    const accessToken = Cookies.get("access_token");

    try {
      const res = await fetch(apiURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCandidates(data);
      } else {
        console.log("Error");
      }
    } catch (error) {
      setStatus({ error: "Network error. Please check your connection." });
    }
  };
  // -----------------

  return (
    <>
      <Box m="20px" style={{ display: showCandidate ? 'none' : 'block' }}>
        <Header title="MANAGE JOBS" subtitle="View and Manage Job Listings" />

        {status && (
          <Box mb="20px">
            <Typography
              color={
                status.success ? colors.greenAccent[500] : colors.redAccent[500]
              }
            >
              {status.success || status.error}
            </Typography>
          </Box>
        )}

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
                <Typography variant="body2" color={colors.grey[300]}>
                  Category: {job.job_category.title}
                </Typography>
                <Typography variant="body2" color={colors.grey[300]}>
                  Location: {job.location}
                </Typography>
                <Typography variant="body2" color={colors.grey[300]}>
                  Salary Range: {job.salary_range}
                </Typography>
                <Typography variant="body2" color={colors.grey[300]}>
                  Experience: {job.experience}
                </Typography>
                <Box mt="10px">
                  <Chip label={job.level} size="small" color="default" />
                  <Chip
                    label={job.status ? "Active" : "Inactive"}
                    size="small"
                    color={job.status ? "info" : "error"}
                    sx={{ ml: 1 }}
                  />
                </Box>
                <Tooltip title={job.description}>
                  <Typography
                    variant="body2"
                    color={colors.grey[300]}
                    sx={{
                      mt: 1,
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
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <motion.button
                    className=" text-blueColor hover:text-[#535ac8] font-semibold transition duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShowList(job.id)}
                  >
                    <span>Show</span>
                  </motion.button>

                  <Box mt="10px" display="flex" justifyContent="">
                    <IconButton onClick={() => handleEdit(job)} color="secondary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleHide(job.id)} color="warning">
                      <VisibilityOffIcon />
                    </IconButton>
                  </Box>
                </div>
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
          onSave={handleUpdatedJob}
          job={selectedJob}
        />
      </Box>

      <Box m="20px" style={{ display: showCandidate ? 'block' : 'none' }}>
        <motion.button
          onClick={handleShowList}
          className="mb-6 flex items-center text-blueColor hover:text-[#535ac8] font-semibold transition duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <KeyboardArrowLeftOutlinedIcon className="mr-1" />
          <span>Back</span>
        </motion.button>

        {candidates.map((item) => (
          <Box
            key={item.id}
            backgroundColor={colors.primary[400]}
            borderRadius="4px"
            p="15px"
          >
            <Typography variant="h5" color={colors.grey[100]}>
              {item.candidate.full_name}
            </Typography>
            <Typography variant="body2" color={colors.grey[300]}>
              Email: {item.candidate.email}
            </Typography>
            <Typography variant="body2" color={colors.grey[300]}>
              Phone: {item.candidate.phone_number}
            </Typography>
            <motion.button
              className="mt-2 text-blueColor hover:text-[#535ac8] font-semibold transition duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenShowDetail(item)}
            >
              Detail
            </motion.button>
          </Box>
        ))} 

        <ApplicationFile 
          open={showDetail}
          onClose={() => {
            setShowDetail(false);
          }}
          dataDetail={dataDetail}
        />
      </Box>
    </>
  );
};

export default ManageJobs;
