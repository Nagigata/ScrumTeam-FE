import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import mockData from "./mockData";
import CVUploadForm from "./CVUpload";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const job = mockData.find((job) => job.id === parseInt(id));

  if (!job) {
    return <div>Job not found</div>;
  }

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
          <div className="col-span-2">
            <div className="jobDetail bg-white p-6 rounded-lg shadow-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-blue-900">
                  {job.title}
                </h1>
                <img
                  src={job.image}
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
                  {job.desc.split("\n").map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="sidebar">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                General Information
              </h3>
              <ul className="text-gray-700">
                <li>
                  <strong>Years of Experience:</strong> {job.experience} năm
                </li>
                <li>
                  <strong>Level:</strong> {job.level}
                </li>
                <li>
                  <strong>Type:</strong> {job.type}
                </li>
                <li>
                  <strong>Contract Type:</strong> {job.contract}
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
              <h3 className="text-lg font-semibold mb-4">Technologies used</h3>
              <div className="flex flex-wrap gap-2">
                {job.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 py-1 px-2 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleOpenModal}
                className="bg-red-600 text-white py-3 px-6 w-full rounded-lg hover:bg-red-700 transition duration-200"
              >
                Apply now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-lg p-8 max-w-2xl w-full">
              <CVUploadForm onClose={handleCloseModal} jobTitle={job.title} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobDetail;
