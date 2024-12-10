import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

const CompanyDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const company_id = location.pathname.split("/").pop();
  const [activeTab, setActiveTab] = useState("about");

  const [companyInfo, setCompanyInfo] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchCompanyData = async () => {
      const apiURL = process.env.REACT_APP_API_URL;
      setLoading(true);
      try {
        const companyResponse = await fetch(
          `${apiURL}/company/company_information/?company_id=${company_id}`
        );
        if (!companyResponse.ok)
          throw new Error("Failed to fetch company data");
        const companyData = await companyResponse.json();
        setCompanyInfo(companyData);

        const jobsResponse = await fetch(
          `${apiURL}/job/job_list_of_company_public/?company_id=${company_id}&page=${currentPage}`
        );

        if (!jobsResponse.ok) throw new Error("Failed to fetch jobs");
        const jobsData = await jobsResponse.json();
        setJobs(jobsData.results);
        setPagination({
          count: jobsData.count,
          next: jobsData.next,
          previous: jobsData.previous,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [company_id, currentPage]);

  const handleNextPage = () => {
    if (pagination.next) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.previous) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const navigateToJob = (job) => {
    navigate(`/job/${job.id}`, { state: { job } });
  };

  const totalPages = Math.ceil(pagination.count / ITEMS_PER_PAGE);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return <div className="text-red-600 text-center p-4">Error: {error}</div>;

  if (!companyInfo)
    return (
      <div className="text-center p-4">No company information available</div>
    );

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Company Info & Jobs */}
        <div className="col-span-2">
          {/* Back Button */}
          <div className="pb-5">
            <button
              onClick={handleGoBack}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <ChevronLeftIcon className="w-5 h-5 mr-2" />
              Back
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg mb-6">
            {/* Company Header */}
            <div className="p-6">
              <div className="flex items-center mb-6">
                <img
                  src={companyInfo.avatar || "/assets/default-company.png"}
                  alt={companyInfo.name}
                  className="w-20 h-20 rounded-lg object-cover mr-4"
                  onError={(e) => {
                    e.target.src = "/assets/default-company.png";
                  }}
                />
                <div>
                  <h1 className="text-3xl font-bold text-blue-900">
                    {companyInfo.name}
                  </h1>
                  <p className="text-gray-600">
                    Founded: {new Date(companyInfo.founded_year).getFullYear()}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex w-full">
                <button
                  className={`flex-1 px-6 py-3 text-sm font-medium ${
                    activeTab === "about"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("about")}
                >
                  About Us
                </button>
                <button
                  className={`flex-1 px-6 py-3 text-sm font-medium ${
                    activeTab === "jobs"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("jobs")}
                >
                  Jobs ({pagination.count})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "about" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">About Us</h2>
                  <p className="text-gray-700">{companyInfo.description}</p>
                </div>
              )}

              {activeTab === "jobs" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Open Positions</h2>
                  {jobs.length > 0 ? (
                    <>
                      {jobs.map((job) => (
                        <div
                          key={job.id}
                          onClick={() => navigateToJob(job)}
                          className="border-b last:border-b-0 py-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 rounded-lg px-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-blue-800 hover:text-blue-600">
                                {job.title}
                              </h3>
                              <p className="text-gray-600">{job.location}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {job.skill_required
                                  ?.split(",")
                                  .map((skill, index) => (
                                    <span
                                      key={index}
                                      className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded"
                                    >
                                      {skill.trim()}
                                    </span>
                                  ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded">
                                {job.level}
                              </span>
                              <p className="text-gray-500 text-sm mt-2">
                                Posted:{" "}
                                {new Date(job.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Pagination Controls */}
                      <div className="flex justify-between items-center mt-8 max-w-2xl mx-auto px-4">
                        <button
                          onClick={handlePrevPage}
                          disabled={!pagination.previous}
                          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          <ChevronLeftIcon className="w-5 h-5 mr-2" />
                          Previous
                        </button>
                        <span className="text-sm text-gray-700">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={handleNextPage}
                          disabled={!pagination.next}
                          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          Next
                          <ChevronRightIcon className="w-5 h-5 ml-2" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No open positions available
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Contact Info */}
        <div className="sidebar">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="font-medium w-24">Hotline:</span>
                <span className="text-gray-700">{companyInfo.hotline}</span>
              </li>
              <li className="flex items-center">
                <span className="font-medium w-24">Website:</span>
                <a
                  href={companyInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {companyInfo.website}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
