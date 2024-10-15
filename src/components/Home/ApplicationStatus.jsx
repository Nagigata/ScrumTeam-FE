import React, { useState, useEffect } from "react";
import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowForwardIcon,
  Info as InfoIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import ApplicationDetails from "./ApplicationDetails";
import mockApplications from "./mockApplication";

const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blueColor";
      case "Interviewed":
        return "bg-indigo-500";
      case "Rejected":
        return "bg-red-500";
      case "Offered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = applications.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(applications.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleOpenDialog = (app) => {
    setSelectedApp(app);
  };

  const handleCloseDialog = () => {
    setSelectedApp(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-greyIsh">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blueColor"></div>
      </div>
    );
  }

  return (
    <div className="w-[85%] m-auto bg-[#e6f9f3]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-textColor">
          Your Application Journey
        </h1>
        <div className="max-w-5xl mx-auto space-y-4 mt-8">
          {currentItems.map((app) => (
            <div
              key={app.id}
              className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={app.logo}
                      alt={`${app.company} Logo`}
                      className="w-12 h-12"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-textColor">
                        {app.position}
                      </h2>
                      <p className="text-gray-600">{app.company}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <CalendarIcon className="text-blueColor mr-2" />
                    <span className="text-gray-700">
                      Applied on: {app.date}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ArrowForwardIcon className="text-blueColor mr-2" />
                    <span className="text-gray-700">Next: {app.nextStep}</span>
                  </div>
                  <div className="flex items-center">
                    <ScheduleIcon className="text-blueColor mr-2" />
                    <span className="text-gray-700">
                      Time Left: {app.timeLeft}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <PersonIcon className="text-blueColor mr-2" />
                    <span className="text-gray-700">
                      Interviewer: {app.interviewer}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-700 mb-1">Application Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blueColor h-2.5 rounded-full"
                      style={{ width: `${app.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-700 text-right mt-1">
                    {app.progress}%
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleOpenDialog(app)}
                    className="text-blueColor hover:text-[#535ac8]"
                    title="View Details"
                  >
                    <InfoIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
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
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
            <ChevronRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      <ApplicationDetails
        application={selectedApp}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default ApplicationStatus;
