import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import SearchCompany from "./SearchCompany";

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
  const location = useLocation();
  const searchParams = location.state;

  const ITEMS_PER_PAGE = 5;

  const fetchCompanies = useCallback(async () => {
    const apiURL = process.env.REACT_APP_API_URL;
    setLoading(true);
    setError(null);
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

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

  const handleSearch = (searchResults) => {
    if (searchResults) {
      setCompanies(searchResults.results);
      setPagination({
        count: searchResults.count,
        next: searchResults.next,
        previous: searchResults.previous,
      });
    } else {
      setCurrentPage(1);
      fetchCompanies();
    }
  };

  useEffect(() => {
    console.log(searchParams);
    if (
      searchParams?.searchKeyword &&
      searchParams?.searchType === "companies"
    ) {
      console.log("ok");
      handleInitialSearch(searchParams.searchKeyword);
    } else {
      console.log("not ok");
      fetchCompanies();
    }
  }, [searchParams]);

  const handleInitialSearch = async (keyword) => {
    const apiURL = process.env.REACT_APP_API_URL;
    try {
      const response = await fetch(
        `${apiURL}/company/list_company/?name=${keyword}&page=1`
      );

      if (!response.ok) {
        throw new Error("Unable to search for the company");
      }

      const data = await response.json();
      setCompanies(data.results);
    } catch (error) {
      console.error("Error while searching for the company:", error);
    }
  };

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
    <div>
      <SearchCompany onSearch={handleSearch} />
      <div className="min-h-screen py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="companyContainer flex gap-10 justify-center flex-wrap items-center py-10">
            {Array.isArray(companies) &&
              companies.map((company) => {
                const { id, name, description, avatar } = company;

                return (
                  <div
                    key={id}
                    className="group group/item singleCompany w-[320px] h-[320px] p-[20px] bg-white rounded-[10px] hover:bg-blueColor shadow-lg shadow-greyIsh-400/700 hover:shadow-lg cursor-pointer transition-all duration-300 flex flex-col"
                    onClick={() => handleCompanyClick(company)}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={avatar || "/assets/default-company.png"}
                        alt="Company Logo"
                        className="w-16 h-16 object-cover rounded-full border-2 border-gray-100"
                        onError={(e) => {
                          e.target.src = "/assets/default-company.png";
                        }}
                      />
                      <h1 className="text-lg font-semibold text-textColor group-hover:text-white line-clamp-2">
                        {name}
                      </h1>
                    </div>

                    <p
                      className="text-[13px] text-[#959595] pt-[20px] border-t-[2px] mt-[20px]
                   group-hover:text-white line-clamp-4"
                    >
                      {description || "No description available"}
                    </p>

                    <button
                      className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold
                     text-textColor hover:bg-white group-hover/item:text-textColor group-hover:text-textColor mt-auto"
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
    </div>
  );
};

export default CompanyList;
