import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useSocket } from "../../contextAPI/SocketProvider";
import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowForwardIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Work as WorkIcon,
} from "@mui/icons-material";

import ApartmentIcon from '@mui/icons-material/Apartment';

const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { message, setURL } = useSocket();
  const [status, setStatus] = useState({ error: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationStatus, setApplicationStatus] = useState({});
  const itemsPerPage = 3;

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    setURL('application_seen');
  }, []);

  useEffect(() => {
    const currentMess = message.split('/')[0];
    const currentID = message.match(/application_id=(\d+)/)?.[1];

    // Cập nhật trạng thái trong bộ nhớ
    setApplicationStatus(prevStatus => ({
      ...prevStatus,
      [currentID]: currentMess === 'Recruiter has seen your application.'
    }));

    // Cập nhật trạng thái trong cookie
    const existingStatus = Cookies.get("status_application");
    let statusArray = existingStatus ? JSON.parse(existingStatus) : [];

    if (!statusArray.some(item => item.id === currentID)) {
      statusArray.push({ id: currentID, mess: currentMess });
      Cookies.set("status_application", JSON.stringify(statusArray), {
        expires: 7,
        path: "/"
      });
    }

    console.log("Check", existingStatus);
  }, [message]);

  const listStatus = Cookies.get("status_application");

  const fetchApplications = async () => {

    const apiURL =
      process.env.REACT_APP_API_URL + "/job/get_list_application_candidate/";
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
        setApplications(data);
        setLoading(false);
      } else {
        setStatus({
          error: "Profile not found. Please complete your candidate profile.",
        });
        setLoading(false);
      }
    } catch (error) {
      setStatus({ error: "Network error. Please check your connection." });
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "Rejected":
        return "bg-red-500";
      case "Accepted":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateTimeString).toLocaleString("en-US", options);
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
          Your Application Journey
        </h1>
        <div className="space-y-6">
          {currentItems.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      <WorkIcon className="text-blueColor text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Application #{app.id}
                      </h2>
                      <p className="text-gray-600">{app.candidate.full_name}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <CalendarIcon className="text-blueColor mr-2" />
                    <span className="text-gray-700">
                      Applied on: {formatDateTime(app.applied_at)}
                    </span>
                  </div>

                  <div className="flex items-center md:justify-self-center">
                    <PersonIcon className="text-blueColor mr-2" />
                    <span className="text-gray-700">
                      Email: {app.candidate.email}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <ScheduleIcon className="text-blueColor mr-2" />
                    <span className="text-gray-700">
                      Urgent: {app.is_urgent ? "Yes" : "No"}
                    </span>
                  </div>

                  <div className="flex items-center md:justify-self-center" style={{transform: 'translateX(-115px)'}}>
                    <ApartmentIcon className="text-blueColor mr-2" />
                    <span className="text-gray-700">
                      Status: {applicationStatus[app.id] ? "Đã xem" : (listStatus && JSON.parse(listStatus).some(item => item.id === app.id.toString()) ? "Đã xem" : "Chưa xem")}
                    </span>
                  </div>

                  {app.cv && (
                    <div className="flex items-center md:justify-self-center">
                      <ArrowForwardIcon className="text-blueColor mr-2" />
                      <a
                        href={app.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blueColor hover:underline"
                      >
                        View CV
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex justify-end"></div>
              </div>
            </div>
          ))}
        </div>
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
      </div>
    </div>
  );
};

export default ApplicationStatus;
