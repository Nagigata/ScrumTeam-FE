import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Search from "../../components/Home/Search";
import Job from "../../components/Home/Job";
import Value from "../../components/Home/Value";

const Home = () => {
  const [keyword, setKeyword] = useState("");
  const [companyKeyword, setCompanyKeyword] = useState("");
  const [locationKeyword, setLocationKeyword] = useState("");
  const [sortValue, setSortValue] = useState("relevance");
  const [typeValue, setTypeValue] = useState("fullTime");
  const [levelValue, setLevelValue] = useState("senior");
  const [searchResults, setSearchResults] = useState([]); // State mới để lưu trữ kết quả tìm kiếm

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

  const handleTypeChange = (typeValue) => {
    setTypeValue(typeValue);
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
        console.log("API Response 1:", data); // Log dữ liệu API để kiểm tra
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

  // Tự động gọi API khi trang được tải
  useEffect(() => {
    fetchJobs(); // Gọi API với từ khóa rỗng
  }, []);

  return (
    <motion.div
      className="w-[85%] m-auto bg-[#e6f9f3]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Search
        onSearch={handleSearch}
        onCompanySearch={handleCompanySearch}
        onLocationSearch={handleLocationSearch}
        onSortChange={handleSortChange} // Truyền hàm handleSortChange
        onTypeChange={handleTypeChange} // Truyền hàm handleTypeChange
        onLevelChange={handleLevelChange} // Truyền hàm handleLevelChange
        onClearAll={handleClearAll} // Truyền hàm handleClearAll
      />
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Job
          keyword={keyword}
          companyKeyword={companyKeyword}
          locationKeyword={locationKeyword}
          sortValue={sortValue} // Truyền giá trị sortValue
          typeValue={typeValue} // Truyền giá trị typeValue
          levelValue={levelValue} // Truyền giá trị levelValue
          searchResults={searchResults} // Truyền kết quả tìm kiếm
        />
      </motion.div>
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

export default Home;
