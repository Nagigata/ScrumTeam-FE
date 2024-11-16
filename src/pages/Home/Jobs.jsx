import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Search from "../../components/Home/Search";
import Job from "../../components/Home/Job";
import { useNavigate, useLocation } from "react-router-dom";

const Jobs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Search states
  const [searchStates, setSearchStates] = useState({
    keyword: "",
    companyKeyword: "",
    locationKeyword: "",
    sortValue: "relevance",
    typeValue: "fullTime",
    levelValue: "senior"
  });

  // Filter states
  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    salaryRanges: [],
    skills: []
  });

  // Selected filters
  const [selectedFilters, setSelectedFilters] = useState({
    location: "",
    salary: "",
    skill: "",
    level: ""
  });

  // Results and pagination
  const [searchResults, setSearchResults] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchFilterOptions();
    if (!location.state) {
      fetchJobs();
    }
  }, []);

  // Handle location state
  useEffect(() => {
    if (location.state) {
      const { searchKeyword, companyKeyword, locationKeyword, selectedFilters: initialFilters } = location.state;
      
      setSearchStates(prev => ({
        ...prev,
        keyword: searchKeyword || "",
        companyKeyword: companyKeyword || "",
        locationKeyword: locationKeyword || ""
      }));

      setSelectedFilters(prev => ({
        ...prev,
        ...initialFilters
      }));

      fetchJobs(searchKeyword, locationKeyword, initialFilters?.salary, initialFilters?.skill);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      setIsLoading(true);
      const [salaryResponse, skillsResponse] = await Promise.all([
        fetch('http://cnpm.duytech.site/api/options/get_all_salary_ranges/'),
        fetch('http://cnpm.duytech.site/api/options/get_all_skills/')
      ]);

      if (salaryResponse.ok && skillsResponse.ok) {
        const [salaryRanges, skills] = await Promise.all([
          salaryResponse.json(),
          skillsResponse.json()
        ]);

        console.log("Fetched skills:", skills); // Debug log

        setFilterOptions(prev => ({
          ...prev,
          salaryRanges,
          skills: skills // API trả về array of objects với {id, skill}
        }));
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
      setError("Failed to load filter options");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch jobs
  const fetchJobs = async (
    keyword = "",
    location = "",
    salary = "",
    skill = "",
    page = 1
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Lấy salary_range text từ filterOptions
      let salaryRangeText = "";
      if (salary) {
        const selectedSalary = filterOptions.salaryRanges.find(
          s => s.id.toString() === salary.toString()
        );
        salaryRangeText = selectedSalary ? selectedSalary.salary_range : "";
      }

      // Lấy skill text từ filterOptions
      let skillText = "";
      if (skill) {
        const selectedSkill = filterOptions.skills.find(
          s => s.skill.toLowerCase() === skill.toLowerCase()
        );
        skillText = selectedSkill ? selectedSkill.skill.toLowerCase() : "";
      }

      console.log("Fetching with params:", {
        keyword,
        location,
        salary_range: salaryRangeText,
        skill_required: skillText
      });

      const queryParams = new URLSearchParams();
      
      if (keyword) queryParams.append('search', keyword);
      if (location) queryParams.append('location', location);
      if (salaryRangeText) queryParams.append('salary_range', salaryRangeText);
      if (skillText) queryParams.append('skill_required', skillText);
      queryParams.append('page', page.toString());

      const url = `http://cnpm.duytech.site/api/job/search/?${queryParams}`;
      console.log("Fetching URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      console.log("API Response:", data);

      setSearchResults(data.results || []);
      setPagination({
        currentPage: page,
        totalPages: Math.ceil((data.count || 0) / 10),
        totalResults: data.count || 0
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to load jobs");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const handleSearch = (keyword) => {
    setSearchStates(prev => ({ ...prev, keyword }));
    fetchJobs(keyword, selectedFilters.location, selectedFilters.salary, selectedFilters.skill, 1);
  };

  const handleLocationSearch = (location) => {
    setSelectedFilters(prev => ({ ...prev, location }));
    fetchJobs(searchStates.keyword, location, selectedFilters.salary, selectedFilters.skill, 1);
  };

  const handleSalaryChange = (salary) => {
    console.log("Selected salary id:", salary);
    setSelectedFilters(prev => ({ ...prev, salary }));
    fetchJobs(searchStates.keyword, selectedFilters.location, salary, selectedFilters.skill, 1);
  };

  const handleSkillChange = (skill) => {
    console.log("Selected skill:", skill); // Debug log
    setSelectedFilters(prev => ({ ...prev, skill }));
    fetchJobs(searchStates.keyword, selectedFilters.location, selectedFilters.salary, skill, 1);
  };

  const handleClearAll = () => {
    setSearchStates({
      keyword: "",
      companyKeyword: "",
      locationKeyword: "",
      sortValue: "relevance",
      typeValue: "fullTime",
      levelValue: "senior"
    });
    setSelectedFilters({
      location: "",
      salary: "",
      skill: "",
      level: ""
    });
    fetchJobs();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    fetchJobs(
      searchStates.keyword,
      selectedFilters.location,
      selectedFilters.salary,
      selectedFilters.skill,
      newPage
    );
  };

  return (
    <motion.div 
      className="w-[85%] m-auto bg-[#e6f9f3] min-h-screen pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Search
        onSearch={handleSearch}
        onCompanySearch={(company) => setSearchStates(prev => ({ ...prev, companyKeyword: company }))}
        onLocationSearch={handleLocationSearch}
        onSortChange={handleSalaryChange}
        onTypeChange={handleSkillChange}
        onClearAll={handleClearAll}
        filterOptions={filterOptions}
        selectedFilters={selectedFilters}
        showFilters={true}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Results */}
      {!isLoading && !error && (
        <>
          <div className="text-center py-4">
            <p className="text-gray-600">
              Found {pagination.totalResults} jobs
            </p>
          </div>

          <Job 
            searchResults={searchResults}
            onJobClick={(jobId) => navigate(`/job/${jobId}`)}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  pagination.currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blueColor text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
              <span className="flex items-center">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`px-4 py-2 rounded-lg ${
                  pagination.currentPage === pagination.totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blueColor text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Jobs;
