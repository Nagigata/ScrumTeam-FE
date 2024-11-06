import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CVUploadForm from "./CVUpload";
import Cookies from "js-cookie";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import PaidIcon from "@mui/icons-material/Paid";

// Thêm styles cho modal overlay
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const fetchJobDetail = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://cnpm.duytech.site/api/job/detail-job/?job_id=${id}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }

      const data = await response.json();
      setJob(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching job details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJobDetail();
    }
  }, [id]);

  useEffect(() => {
    if (job) {
      checkFollowStatus();
      checkAppliedStatus();
    }
  }, [job]);

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;
  }

  if (!job) {
    return <div className="p-10 text-center">No job details available</div>;
  }

  const checkFollowStatus = async () => {
    if (!job?.id) return;

    const apiURL = "http://cnpm.duytech.site/api/job/user-get-list-follow-job/";
    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      console.log("No access token found");
      return;
    }

    try {
      const response = await fetch(apiURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Kiểm tra xem job hiện tại có trong danh sách followed jobs không
        const isJobFollowed = data.some(followedJob => followedJob.job_id === job.id);
        setIsFollowed(isJobFollowed);
        console.log("Follow status:", isJobFollowed);
      } else {
        console.error("Failed to get followed jobs:", response.status);
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollowToggle = async () => {
    const apiURL = "http://cnpm.duytech.site/api/job/follow/";
    const accessToken = Cookies.get("access_token");

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          job_id: job.id,
        }),
      });

      if (response.ok) {
        setIsFollowed((prev) => !prev);
        alert(`Job ${isFollowed ? "unfollowed" : "followed"} successfully.`);
      } else {
        alert("Failed to follow/unfollow the job. Please try again.");
      }
    } catch (error) {
      console.error("Error following/unfollowing the job:", error);
      alert("Network error. Please check your connection.");
    }
  };

  const handleOpenUploadModal = () => {
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  const checkAppliedStatus = async () => {
    if (!job?.id) return;

    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      console.log("No access token found");
      return;
    }

    try {
      const response = await fetch(
        `http://cnpm.duytech.site/api/job/check_candidate_applied_job/?job_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsApplied(data.is_applied); // Giả sử API trả về {is_applied: boolean}
      } else {
        console.error("Failed to check applied status:", response.status);
      }
    } catch (error) {
      console.error("Error checking applied status:", error);
    }
  };

  const refreshJobData = async () => {
    await Promise.all([
      fetchJobDetail(),
      checkAppliedStatus(),
      checkFollowStatus()
    ]);
  };

  const handleApplySuccess = async () => {
    setShowUploadModal(false);
    setIsApplied(true);
    await refreshJobData(); // Refresh toàn bộ dữ liệu
  };

  return (
    <>
      <div className="jobDetailContainer p-10 bg-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-500 hover:underline"
        >
          Quay lại
        </button>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="col-span-2">
            <div className="jobDetail bg-white p-6 rounded-lg shadow-lg mb-6">
              {/* Job Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-blue-900">{job.title}</h1>
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                    {job.job_type}
                  </span>
                </div>
              </div>

              {/* Location & Address */}
              <div className="flex items-center mb-4 text-gray-600">
                <LocationOnIcon className="mr-2" />
                <span>{job.location}</span>
                {job.specific_address && (
                  <span className="ml-2">• {job.specific_address}</span>
                )}
              </div>

              {/* Job Description */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>

              {/* Role & Responsibilities */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Role & Responsibilities</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {job.role_and_responsibilities}
                </p>
              </div>

              {/* Interview Process */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Interview Process</h2>
                <p className="text-gray-700">
                  {job.interview_process}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="sidebar">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Job Overview</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-center">
                  <WorkIcon className="mr-2 text-gray-500" />
                  <div>
                    <strong className="block">Level:</strong>
                    {job.level}
                  </div>
                </li>
                <li className="flex items-center">
                  <AccessTimeOutlinedIcon className="mr-2 text-gray-500" />
                  <div>
                    <strong className="block">Experience Required:</strong>
                    {job.minimum_years_of_experience}
                  </div>
                </li>
                <li className="flex items-center">
                  <PaidIcon className="mr-2 text-gray-500" />
                  <div>
                    <strong className="block">Salary Range:</strong>
                    {job.salary_range}
                  </div>
                </li>
                <li className="flex items-center">
                  <WorkIcon className="mr-2 text-gray-500" />
                  <div>
                    <strong className="block">Contract Type:</strong>
                    {job.contract_type}
                  </div>
                </li>
                <li>
                  <strong className="block mb-2">Benefits:</strong>
                  <p className="text-gray-600">{job.benefits}</p>
                </li>
              </ul>
            </div>

            {/* Skills Required */}
            <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
              <h3 className="text-lg font-semibold mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skill_required.split(',').map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 py-1 px-3 rounded-lg"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Application Buttons */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handleOpenUploadModal}
                disabled={isApplied}
                className={`flex-1 py-3 px-6 rounded-lg transition-colors ${
                  isApplied 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {isApplied ? "Applied" : "Apply Now"}
              </button>
              <button
                onClick={handleFollowToggle}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={isFollowed ? "/assets/follow_on.png" : "/assets/follow_off.png"}
                  alt="Follow Icon"
                  className="w-6 h-6"
                />
              </button>
            </div>

            {/* Expiration Date */}
            <div className="mt-4 text-center text-gray-500 text-sm">
              Application deadline: {new Date(job.expired_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* CV Upload Modal - Move outside main container */}
      {showUploadModal && !isApplied && (
        <div style={modalOverlayStyle}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-[500px] relative">
            <CVUploadForm 
              onClose={handleCloseUploadModal} 
              jobId={job.id}
              onSuccess={handleApplySuccess}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default JobDetail;
