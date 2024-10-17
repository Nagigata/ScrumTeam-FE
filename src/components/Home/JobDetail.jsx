import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CVUploadForm from "./CVUpload";

const JobDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;
  const [showUploadModal, setShowUploadModal] = useState(false);

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
                src={job.avatar_url}
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
                {job.description.split("\n").map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

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

          <div className="mt-6">
            <button
              onClick={handleOpenUploadModal}
              className="bg-red-600 text-white py-3 px-6 w-full rounded-lg hover:bg-red-700"
            >
              Apply now
            </button>
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
