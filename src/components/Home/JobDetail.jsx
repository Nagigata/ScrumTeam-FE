import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CVUploadForm from "./CVUpload";
import Cookies from "js-cookie";

const JobDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;
  
  // Khai báo state isFollowed
  const [isFollowed, setIsFollowed] = useState(false);
  // Khai báo state showUploadModal
  const [showUploadModal, setShowUploadModal] = useState(false);

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

  useEffect(() => {
    checkFollowStatus();
  }, [job?.id]);

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

  if (!job) {
    return <div>No job details available</div>;
  }

  const handleOpenUploadModal = () => {
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  return (
    <div className="jobDetailContainer p-10 bg-gray-100">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:underline"
      >
        Quay lại
      </button>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="jobDetail bg-white p-6 rounded-lg shadow-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-blue-900">{job.title}</h1>
              <img
                src={job.avatar_company}
                alt="Company Logo"
                className="w-16 h-16 rounded-full"
              />
            </div>

            <div className="flex items-center mb-2 text-gray-600">
              <AccessTimeOutlinedIcon className="mr-2" />
              <span>{job.time}</span>
            </div>
            <p className="text-gray-600">{job.location}</p>

            <div className="jobDescription mt-6">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <ul className="list-disc list-inside text-gray-700">
                {job.description ? 
                  job.description.split("\n").map((line, index) => (
                    <li key={index}>{line}</li>
                  ))
                  : 
                  <li>No description available</li>
                }
              </ul>
            </div>
          </div>
        </div>

        {/* Cột bên phải: Thông tin bổ sung */}
        <div className="sidebar">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">General Information</h3>
            <ul className="text-gray-700">
              <li>
                <strong>Years of Experience:</strong> {job.experience || "N/A"}
              </li>
              <li>
                <strong>Benefit:</strong> {job.benefits || "N/A"}
              </li>
              <li>
                <strong>Salary:</strong> {job.salary_range || "N/A"}
              </li>
              <li>
                <strong>Contract Type:</strong> {job.contract || "N/A"}
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-lg font-semibold mb-4">Technologies used</h3>
            <div className="flex flex-wrap gap-2">
              {job.skill_required ? (
                job.skill_required.split(",").map((tech, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 py-1 px-2 rounded-lg"
                  >
                    {tech.trim()}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No technologies listed</span>
              )}
            </div>
          </div>
          
          {/* Nút Apply Now và Follow */}
          <div className="mt-6 flex items-center">
            <button 
             onClick={handleOpenUploadModal}
            className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700">
              Apply now
            </button>
            <img
              src={isFollowed ? "/assets/follow_on.png" : "/assets/follow_off.png"}
              alt="Follow Icon"
              className="ml-4 w-8 h-8 cursor-pointer"
              onClick={handleFollowToggle}
            />
          </div>
        </div>
      </div>

      {/* Modal for CV Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <CVUploadForm onClose={handleCloseUploadModal} jobId={job.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
