import React from "react";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";

const ApplicationDetails = ({ application, onClose }) => {
  if (!application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="bg-blueColor text-white py-4 px-6 rounded-t-lg">
          <h3 className="text-lg font-semibold">Application Details</h3>
        </div>
        <div className="p-6">
          <h4 className="text-xl font-semibold text-textColor mt-4">
            {application.position} at {application.company}
          </h4>
          <p className="text-gray-600 mb-4">Applied on: {application.date}</p>
          <h5 className="text-lg font-semibold text-textColor mt-4 mb-2">
            Application Stages:
          </h5>
          <div className="space-y-2">
            {application.stages.map((stage, index) => (
              <div key={index} className="flex items-center">
                {stage.completed ? (
                  <CheckIcon className="text-blueColor mr-2" />
                ) : (
                  <CloseIcon className="text-gray-400 mr-2" />
                )}
                <span
                  className={
                    stage.completed ? "text-blueColor" : "text-gray-600"
                  }
                >
                  {stage.name}
                </span>
              </div>
            ))}
          </div>
          <h5 className="text-lg font-semibold text-textColor mt-4 mb-2">
            Next Steps:
          </h5>
          <p className="text-gray-600">{application.nextStep}</p>
          <p className="text-gray-600 mt-2">
            Time Left: {application.timeLeft}
          </p>
        </div>
        <div className="bg-gray-100 px-6 py-4 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="text-blueColor hover:text-[#535ac8] font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
