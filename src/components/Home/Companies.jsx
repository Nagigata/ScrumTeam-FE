import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 5; 

  useEffect(() => {
    const apiURL = process.env.REACT_APP_API_URL;
    const fetchCompanies = async () => {
      try {
        const response = await fetch(
          `${apiURL}/company/list_company/?page=${currentPage}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }
        const data = await response.json();
        setCompanies(data.results);
        setPagination({
          count: data.count,
          next: data.next,
          previous: data.previous,
        });
      } catch (err) {
        setError(err.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [currentPage]);

  const handleCompanyClick = (company) => {
    navigate(`/company/${company.id}`);
  };

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

  const totalPages = Math.ceil(pagination.count / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-greyIsh">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blueColor"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen py-12 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="companyContainer flex gap-10 justify-center flex-wrap items-center py-10">
          {Array.isArray(companies) &&
            companies.map((company) => {
              const { id, name, description, avatar } = company;

              return (
                <div
                  key={id}
                  className="group group/item singleCompany w-[270px] p-[20px] bg-white rounded-[10px] hover:bg-blueColor shadow-lg shadow-greyIsh-400/700 hover:shadow-lg cursor-pointer transition-all duration-300"
                  onClick={() => handleCompanyClick(company)}
                >
                  <span className="flex justify-between items-center gap-4">
                    <h1 className="text-[16px] font-semibold text-textColor group-hover:text-white">
                      {name}
                    </h1>
                  </span>

                  <div className="company flex items-center gap-2 my-[1rem]">
                    <img
                      src={avatar || "/assets/default-company.png"}
                      alt="Company Logo"
                      className="w-[40px] h-[40px] object-cover rounded-full"
                      onError={(e) => {
                        e.target.src = "/assets/default-company.png";
                      }}
                    />
                  </div>

                  <p className="text-[13px] text-[#959595] pt-[20px] border-t-[2px] mt-[20px] group-hover:text-white h-[60px] overflow-hidden">
                    {description || "No description available"}
                  </p>

                  <button
                    className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-textColor hover:bg-white group-hover/item:text-textColor group-hover:text-textColor mt-[1rem]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompanyClick(company);
                    }}
                  >
                    View Company
                  </button>
                </div>
              );
            })}
        </div>

        {/* Pagination Controls */}
        {companies.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default CompanyList;
