import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  Work as WorkIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const FollowingJob = () => {
  const [followedJobs, setFollowedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ error: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const navigate = useNavigate();

  useEffect(() => {
    fetchFollowedJobs();
  }, []);

  const fetchFollowedJobs = async () => {
    const apiURL = "http://cnpm.duytech.site/api/job/user-get-list-follow-job/";
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
        setFollowedJobs(data);
        setLoading(false);
      } else {
        setStatus({
          error: "Failed to fetch followed jobs. Please try again later.",
        });
        setLoading(false);
      }
    } catch (error) {
      setStatus({ error: "Network error. Please check your connection." });
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = followedJobs.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(followedJobs.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const truncateDescription = (description, maxLength) => {
    if (!description) return "No description available";
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  const handleJobClick = async (jobId) => {
    const apiURL = `http://cnpm.duytech.site/api/job/detail-job/?job_id=${jobId}`;
    const accessToken = Cookies.get("access_token");

    try {
      const response = await fetch(apiURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const jobDetail = await response.json();
        navigate(`/job/${jobId}`, { state: { job: jobDetail } });
      } else {
        console.error("Failed to fetch job details");
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-greyIsh">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blueColor"></div>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="flex justify-center items-center h-screen bg-greyIsh">
        <p className="text-red-500">{status.error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Jobs You're Following
        </h1>
        <div className="space-y-6">
          {currentItems.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
              onClick={() => handleJobClick(job.job_id)}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      <WorkIcon className="text-blueColor text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {job.job_title}
                      </h2>
                      <p className="text-gray-600">Job ID: {job.job_id}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {followedJobs.length > 0 && (
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
            >
              <ChevronLeftIcon className="w-5 h-5 mr-2" />
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
            >
              Next
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {followedJobs.length === 0 && !loading && !status.error && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              You haven't followed any jobs yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowingJob;

