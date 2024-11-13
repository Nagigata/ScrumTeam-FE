import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Search from "../../components/Home/Search";
import Value from "../../components/Home/Value";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import PaidIcon from '@mui/icons-material/Paid';

const Home = () => {
  const [keyword, setKeyword] = useState("");
  const [companyKeyword, setCompanyKeyword] = useState("");
  const [locationKeyword, setLocationKeyword] = useState("");
  const [sortValue, setSortValue] = useState("relevance");
  const [typeValue, setTypeValue] = useState("fullTime");
  const [levelValue, setLevelValue] = useState("senior");
  const [searchResults, setSearchResults] = useState([]);
  const [topJobs, setTopJobs] = useState([]);
  const [topNewJobs, setTopNewJobs] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const navigate = useNavigate();
  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    salaryRanges: [],
    skills: []
  });

  const handleSearch = (keyword) => {
    setKeyword(keyword);
    fetchJobs(keyword); // Gọi fetchJobs với từ khóa tìm kiếm
  };

  const handleCompanySearch = (searchCompanyKeyword) => {
    setCompanyKeyword(searchCompanyKeyword);
  };

  const handleLocationSearch = (searchLocationKeyword) => {
    setLocationKeyword(searchLocationKeyword);
    fetchJobs(keyword, searchLocationKeyword); // Gọi fetchJobs với từ khóa và địa điểm
  };

  const handleSortChange = (sortValue) => {
    setSortValue(sortValue);
    fetchJobs(keyword, locationKeyword, levelValue, sortValue); // Gọi fetchJobs với từ khóa, địa điểm, mức lương và kỹ năng
  };

  const handleTypeChange = (skill) => {
    console.log("Selected skill:", skill); // Debug log
    setTypeValue(skill);
    fetchJobs(keyword, locationKeyword, sortValue, skill);
  };

  const handleLevelChange = (levelValue) => {
    setLevelValue(levelValue);
    fetchJobs(keyword, locationKeyword, levelValue); // Gọi fetchJobs với từ khóa, địa điểm và mức lương
  };

  const handleClearAll = () => {
    setKeyword("");
    setCompanyKeyword("");
    setLocationKeyword("");
    setSortValue("relevance");
    setTypeValue("fullTime");
    setLevelValue("senior");
  };

  // Hàm để gọi API tìm kiếm
  const fetchJobs = async (
    keyword = "",
    location = "",
    salaryRange = "",
    skill = ""
  ) => {
    try {
      const response = await fetch(
        `http://cnpm.duytech.site/api/job/search/?search=${keyword}&location=${location}&salary_range=${salaryRange}&skill_required=${skill}`
      );
      if (response.ok) {
        const data = await response.json();
        //console.log("API Response 1:", data); // Log dữ liệu API để kiểm tra
        setSearchResults(Array.isArray(data.results) ? data.results : []);
      } else {
        console.error("Failed to fetch jobs");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setSearchResults([]);
    }
  };

  // Thêm function để fetch top jobs
  const fetchTopJobs = async () => {
    try {
      const response = await fetch('http://cnpm.duytech.site/api/job/top_outstanding_jobs/');
      if (response.ok) {
        const data = await response.json();
        setTopJobs(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch top jobs");
        setTopJobs([]);
      }
    } catch (error) {
      console.error("Error fetching top jobs:", error);
      setTopJobs([]);
    }
  };

  // Thêm function để fetch top new jobs
  const fetchTopNewJobs = async () => {
    try {
      const response = await fetch('http://cnpm.duytech.site/api/job/top_new_jobs/');
      if (response.ok) {
        const data = await response.json();
        setTopNewJobs(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch top new jobs");
        setTopNewJobs([]);
      }
    } catch (error) {
      console.error("Error fetching top new jobs:", error);
      setTopNewJobs([]);
    }
  };

  // Thêm function để fetch top companies
  const fetchTopCompanies = async () => {
    try {
      const response = await fetch('http://cnpm.duytech.site/api/company/top_outstanding_companies/');
      if (response.ok) {
        const data = await response.json();
        setTopCompanies(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch top companies");
        setTopCompanies([]);
      }
    } catch (error) {
      console.error("Error fetching top companies:", error);
      setTopCompanies([]);
    }
  };

  // Tự động gọi API khi trang được tải
  useEffect(() => {
    fetchTopJobs();
    fetchTopNewJobs();
    fetchTopCompanies();
  }, []);

  // Fetch filter options
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      // Chỉ cần fetch salary ranges và skills vì chúng ta không dùng locations nữa
      const [salaryRes, skillsRes] = await Promise.all([
        fetch('http://cnpm.duytech.site/api/options/get_all_salary_ranges/'),
        fetch('http://cnpm.duytech.site/api/options/get_all_skills/')
      ]);

      if (!salaryRes.ok || !skillsRes.ok) {
        throw new Error('Failed to fetch filter options');
      }

      const [salaryRanges, skills] = await Promise.all([
        salaryRes.json(),
        skillsRes.json()
      ]);

      console.log("Fetched skills:", skills); // Debug log

      setFilterOptions({
        salaryRanges,
        skills, // API trả về array of objects với {id, skill}
        locations: [] // Giữ lại để tránh lỗi undefined
      });
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  return (
    <motion.div
      className="w-[85%] m-auto bg-[#e6f9f3]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Search Section */}
      <Search
        onSearch={handleSearch}
        onCompanySearch={handleCompanySearch}
        onLocationSearch={handleLocationSearch}
        onSortChange={handleSortChange}
        onTypeChange={handleTypeChange}
        onLevelChange={handleLevelChange}
        onClearAll={handleClearAll}
        filterOptions={filterOptions}
        selectedFilters={{
          location: locationKeyword,
          salary: sortValue,
          skill: typeValue
        }}
        showFilters={false}
      />

      {/* Top Outstanding Companies Section */}
      <div className="py-10">
        <h2 className="text-2xl font-bold text-textColor mb-6 text-center">
          Top Outstanding Companies
        </h2>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="companyContainer flex gap-10 justify-center flex-wrap items-center py-10"
        >
          {topCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </motion.div>
      </div>

      {/* Top Outstanding Jobs Section */}
      <div className="py-10">
        <h2 className="text-2xl font-bold text-textColor mb-6 text-center">
          Top Outstanding Jobs
        </h2>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="jobContainer flex gap-10 justify-center flex-wrap items-center py-10"
        >
          {topJobs.map((job) => (
            <JobCard key={job.id} job={job} onJobClick={handleJobClick} />
          ))}
        </motion.div>
      </div>

      {/* Top New Jobs Section */}
      <div className="py-10">
        <h2 className="text-2xl font-bold text-textColor mb-6 text-center">
          Top New Jobs
        </h2>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="jobContainer flex gap-10 justify-center flex-wrap items-center py-10"
        >
          {topNewJobs.map((job) => (
            <JobCard key={job.id} job={job} onJobClick={handleJobClick} />
          ))}
        </motion.div>
      </div>

      {/* Value Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Value />
      </motion.div>
    </motion.div>
  );
};

// Tạo component JobCard riêng để tái sử dụng
const JobCard = ({ job, onJobClick }) => {
  return (
    <div
      className="group group/item singleJob w-[300px] p-[20px] bg-white rounded-[10px] hover:bg-blueColor shadow-lg shadow-greyIsh-400/700 hover:shadow-lg"
      onClick={() => onJobClick(job.id)}
    >
      {/* Company Info */}
      <div className="company flex items-center gap-2 mb-4">
        {job.avatar_company ? (
          <img
            src={job.avatar_company}
            alt="Company Logo"
            className="w-[50px] h-[50px] rounded-full"
          />
        ) : (
          <div className="w-[50px] h-[50px] bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Logo</span>
          </div>
        )}
        <div>
          <span className="text-[14px] font-semibold block group-hover:text-white">
            {job.company}
          </span>
        </div>
      </div>

      {/* Job Title */}
      <div className="mb-4">
        <h1 className="text-[16px] font-semibold text-textColor group-hover:text-white">
          {job.title}
        </h1>
      </div>

      {/* Location & Experience */}
      <div className="flex flex-col gap-2">
        <span className="flex items-center text-[#959595] gap-1 text-[13px] group-hover:text-white">
          <LocationOnIcon className="text-[16px]" />
          {job.location}
        </span>
        <span className="flex items-center text-[#959595] gap-1 text-[13px] group-hover:text-white">
          <WorkIcon className="text-[16px]" />
          {job.level}
        </span>
        {job.salary_range && (
          <span className="flex items-center text-[#959595] gap-1 text-[13px] group-hover:text-white">
            <PaidIcon className="text-[16px]" />
            {job.salary_range}
          </span>
        )}
      </div>

      {/* Skills */}
      <div className="mt-4">
        <p className="text-[13px] text-[#959595] group-hover:text-white">
          Skills: {job.skill_required}
        </p>
      </div>

      {/* Apply Button */}
      <button className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-textColor hover:bg-white group-hover/item:text-textColor group-hover:text-white mt-4">
        Apply Now
      </button>

      {/* Posted Date */}
      <div className="mt-3 text-right">
        <span className="text-[12px] text-[#959595] group-hover:text-white">
          Posted: {new Date(job.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

// Tạo component CompanyCard
const CompanyCard = ({ company }) => {
  return (
    <div className="group w-[300px] h-[320px] p-[20px] bg-white rounded-[10px] hover:bg-blueColor shadow-lg shadow-greyIsh-400/700 hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Company Logo */}
      <div className="flex justify-center mb-4">
        {company.avatar ? (
          <img
            src={company.avatar}
            alt={`${company.name} Logo`}
            className="w-[100px] h-[100px] rounded-full object-cover border-4 border-[#e6f9f3] group-hover:border-white"
          />
        ) : (
          <div className="w-[100px] h-[100px] bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-400">
              {company.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Company Info Container */}
      <div className="flex flex-col flex-1">
        {/* Company Name */}
        <div className="text-center mb-2">
          <h3 className="text-[18px] font-bold text-textColor group-hover:text-white truncate px-2">
            {company.name}
          </h3>
        </div>

        {/* Company Description - với chiều cao cố định và xử lý overflow */}
        <div className="text-center mb-4 flex-1 overflow-hidden max-h-[100px]">
          <p className="text-[14px] text-[#959595] group-hover:text-white line-clamp-4 px-2">
            {company.description || "No description available"}
          </p>
        </div>

        {/* View Profile Button - Fixed at bottom */}
        <div className="mt-auto">
          <button className="w-full py-2 px-4 rounded-lg border-2 border-[#959595] text-[#959595] group-hover:border-white group-hover:text-white transition-all duration-300 text-[14px] font-semibold hover:bg-white hover:text-blueColor">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
