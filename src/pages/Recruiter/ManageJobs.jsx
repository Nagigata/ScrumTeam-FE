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
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import PaidIcon from "@mui/icons-material/Paid";
import ReplayIcon from '@mui/icons-material/Replay';
import { useNavigate } from "react-router-dom";
import RepostJob from "../../components/Recruiter/RepostJob";
import ApplicationApproved from "../../components/Recruiter/ApplicationApproved";

const ManageJobs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [showCandidate, setShowCandidate] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [dataDetail, setDataDetail] = useState({});
  const [applicationStatuses, setApplicationStatuses] = useState({});
  const [isRepostDialogOpen, setIsRepostDialogOpen] = useState(false);
  const [approveClickStates, setApproveClickStates] = useState({});
  const [approvedApplications, setApprovedApplications] = useState({});
  const [showInterviewButtons, setShowInterviewButtons] = useState({});
  const [idCandidate, setIdCandidate] = useState('');
  const [submitType, setSubmitType] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const getStatusChipColor = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Pending":
        return "warning";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
        console.log(data)
        setJobs(data);
      } else {
        const errorData = await res.json();
        console.log("Error response from server:", errorData);
        setStatus({
          error: errorData.detail || "Failed to fetch jobs. Please try again.",
        });
      }
    } catch (error) {
      setStatus({ error: "Network error. Please check your connection." });
    }
  };

  const handleEdit = (job) => {
    if (!job) return;
    
    const jobForEdit = {
      ...job,
      job_type: job.job_type || "",
      title: job.title || "",
      description: job.description || "",
      skill_required: job.skill_required || "",
      benefits: job.benefits || "",
      location: job.location || "",
      specific_address: job.specific_address || "",
      salary_range: job.salary_range || "",
      level: job.level || "",
      minimum_years_of_experience: job.minimum_years_of_experience || "",
      role_and_responsibilities: job.role_and_responsibilities || "",
      contract_type: job.contract_type || "",
      interview_process: job.interview_process || "",
      expired_at: job.expired_at ? job.expired_at.split('T')[0] : "",
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
          status: updatedJob.status === "Active" ? "Active" : "Inactive",
          experience: updatedJob.experience,
          interview_process: updatedJob.interview_process,
          expired_at: updatedJob.expired_at,
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
    const apiURL = process.env.REACT_APP_API_URL + "/job/hide_job/";
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
    alert(">>> " + data.id);
    const fetchData = async () => {
      const apiURL = process.env.REACT_APP_API_URL + "/job/view_cv_in_application/?application_id=" + data.id;
      const accessToken = Cookies.get("access_token");
      try {
        const response = await fetch(apiURL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("Message: ", data.message);
        } else {
          const errorData = await response.json();
          console.log("Failed to hide job. Please try again.");
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  };

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
        setCandidates(data); // Đảm bảo rằng `data` chứa thông tin `status` cho từng ứng viên
      } else {
        console.log("Error");
      }
    } catch (error) {
      setStatus({ error: "Network error. Please check your connection." });
    }
  };
  // -----------------

  const handleApplicationStatus = async (applicationId, status) => {
    const accessToken = Cookies.get("access_token");

    const apiURL_Candidate = `${process.env.REACT_APP_API_URL}/job/get_application_infor/?application_id=${applicationId}`;

    try {
      const res = await fetch(apiURL_Candidate, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setIdCandidate(data.candidate.id);
      } else {
        console.log("Error");
      }
    } catch (error) {
      setStatus({ error: "Network error. Please check your connection." });
    }

    if (status === "Accepted") {
      setApproveClickStates(prev => ({
        ...prev,
        [applicationId]: true
      }));
      setShowModal(true);
    }
    // --------------------------------------------------------------------------------

    const apiURL = "http://cnpm.duytech.site/api/job/approve_application/";
    try {
      const response = await fetch(apiURL, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          application_id: applicationId,
          status: status,
        }),
      });

      if (response.ok) {
        const message =
          status === "Accepted" ? "Approve success" : "Reject success";
        alert(message);

        // Cập nhật trạng thái phê duyệt hoặc từ chối
        setApplicationStatuses((prev) => ({
          ...prev,
          [applicationId]: status,
        }));
      } else {
        alert("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please check your connection.");
    }
  };

  const handleModalClose = (applicationId, wasSaved) => {
    if (wasSaved) {
      setApprovedApplications(prev => ({
        ...prev,
        [applicationId]: true
      }));
    } else {
      setApproveClickStates(prev => ({
        ...prev,
        [applicationId]: false
      }));
    }
    setShowModal(false);
  };

  const handleRepost = (job) => {
    setSelectedJob(job);
    setIsRepostDialogOpen(true);
  };

  const handleRepostSuccess = async (data) => {
    // Chỉ ẩn job cũ khi repost thành công
    if (selectedJob) {
      await handleHide(selectedJob.id);
    }
    fetchJobs(); // Refresh danh sách
    setIsRepostDialogOpen(false);
  };

  const handleRepostedJob = async (repostedJob) => {
    // Add your repost API logic here
    // Similar to handleUpdatedJob but with different endpoint
  };

  return (
    <>
      <Box m="20px" style={{ display: showCandidate ? "none" : "block" }}>
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
            {console.log(jobs)}
            {jobs.map((job) => (
              <Box
                key={job.id}
                backgroundColor={colors.primary[400]}
                borderRadius="4px"
                p="15px"
                sx={{
                  opacity: job.is_expired ? 0.7 : 1,
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" color={colors.grey[100]} fontWeight="bold">
                    {job.title}
                  </Typography>
                  <Chip
                    label={job.is_expired ? "Expired" : job.status}
                    size="small"
                    color={getStatusChipColor(job.status)}
                  />
                </Box>

                <Box mt={2}>
                  <Typography variant="body2" color={colors.grey[300]}>
                    <LocationOnIcon sx={{ fontSize: 16, mr: 1 }} />
                    {job.location}
                    {job.specific_address && ` - ${job.specific_address}`}
                  </Typography>

                  <Typography variant="body2" color={colors.grey[300]} mt={1}>
                    <WorkIcon sx={{ fontSize: 16, mr: 1 }} />
                    Level: {job.level}
                  </Typography>

                  {job.salary_range && (
                    <Typography variant="body2" color={colors.grey[300]} mt={1}>
                      <PaidIcon sx={{ fontSize: 16, mr: 1 }} />
                      Salary: {job.salary_range}
                    </Typography>
                  )}
                </Box>

                <Box mt={2}>
                  <Typography variant="body2" color={colors.grey[300]}>
                    Skill Required:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                    {job.skill_required?.split(',').map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill.trim()}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: colors.grey[300] }}
                      />
                    ))}
                  </Box>
                </Box>

                {job.benefits && (
                  <Box mt={2}>
                    <Typography variant="body2" color={colors.grey[300]}>
                      Benefits:
                    </Typography>
                    <Typography variant="body2" color={colors.grey[300]} mt={1}>
                      {job.benefits}
                    </Typography>
                  </Box>
                )}

                <Box mt={2}>
                  <Typography variant="body2" color={colors.grey[300]}>
                    Created at: {formatDate(job.created_at)}
                  </Typography>
                  <Typography variant="body2" color={colors.grey[300]}>
                    Expired at: {formatDate(job.expired_at)}
                  </Typography>
                </Box>


                {job.status === "Rejected" ? (
                  <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Tooltip title={job.rejection_reason || "No reason provided"}>
                      <Chip
                        label="Rejection reason"
                        color="error"
                        size="small"
                      />
                    </Tooltip>
                    <IconButton
                      onClick={() => handleRepost(job)}
                      color="primary"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(144, 202, 249, 0.08)',
                        },
                      }}
                    >
                      <ReplayIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                    <motion.button
                      className="text-blueColor hover:text-[#535ac8] font-semibold transition duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShowList(job.id)}
                    >
                      View candidates
                    </motion.button>

                    <Box display="flex" gap={1}>
                      <IconButton
                        onClick={() => handleEdit(job)}
                        color="secondary"
                        disabled={job.is_expired || job.status === "Rejected"}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleHide(job.id)}
                        color="warning"
                        disabled={job.is_expired}
                      >
                        <VisibilityOffIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
            {console.log(selectedJob)}
        <EditJob
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedJob(null);
            fetchJobs();
          }}
          onSave={handleUpdatedJob}
          job={selectedJob}
        />
      </Box>

      <Box m="20px" style={{ display: showCandidate ? "block" : "none" }}>
        <motion.button
          onClick={handleShowList}
          className="mb-6 flex items-center text-blueColor hover:text-[#535ac8] font-semibold transition duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <KeyboardArrowLeftOutlinedIcon className="mr-1" />
          <span>Back</span>
        </motion.button>

        {candidates.map((item) => {
        const currentStatus = applicationStatuses[item.id] || item.status;
        const isApproved = approvedApplications[item.id];
        const hasClickedApprove = approveClickStates[item.id];

          return (
            <Box
              key={item.id}
              backgroundColor={colors.primary[400]}
              borderRadius="4px"
              p="15px"
              display="flex"
              alignItems="center"
            >
              <Box flex="1">
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
              {isApproved ? (
              <button
                className="py-3 px-6 rounded-lg bg-gray-400 text-white"
                style={{ marginLeft: "auto" }}
                disabled
              >
                Approved
              </button>
            ) : hasClickedApprove ? (
              <button
                className="py-3 px-6 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                style={{ marginLeft: "auto" }}
                onClick={() => {
                  setIdCandidate(item.candidate.id);
                  setShowModal(true);
                }}
              >
                Set Interview Information
              </button>
            ) : (
              <button
                className="py-3 px-6 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                style={{ marginLeft: "auto" }}
                onClick={() => handleApplicationStatus(item.id, "Accepted")}
              >
                Approve
              </button>
            )}
              <button
                className={`py-3 px-6 rounded-lg ${
                  currentStatus === "Rejected"
                    ? "bg-gray-400"
                    : "bg-red-600 hover:bg-red-700"
                } text-white`}
                style={{ marginLeft: "50px" }}
                onClick={() => handleApplicationStatus(item.id, "Rejected")}
                disabled={currentStatus === "Rejected"}
              >
                {currentStatus === "Rejected" ? "Rejected" : "Reject"}
              </button>
            </Box>
          );
        })}

        <ApplicationFile
          open={showDetail}
          onClose={() => {
            setShowDetail(false);
          }}
          dataDetail={dataDetail}
        />
      <ApplicationApproved
        open={showModal}
        onClose={(wasSaved) => handleModalClose(idCandidate, wasSaved)}
        idCandidate={idCandidate}
        setSubmitType={setSubmitType}
      />
      </Box>
      <RepostJob
        open={isRepostDialogOpen}
        onClose={() => setIsRepostDialogOpen(false)}
        onSave={handleRepostSuccess}
        job={selectedJob}
      />
    </>
  );
};

export default ManageJobs;