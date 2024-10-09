import React, { useState } from "react";
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

  const handleSearch = (searchKeyword) => {
    setKeyword(searchKeyword);
  };

  const handleCompanySearch = (searchCompanyKeyword) => {
    setCompanyKeyword(searchCompanyKeyword);
  };

  const handleLocationSearch = (searchLocationKeyword) => {
    setLocationKeyword(searchLocationKeyword);
  };

  const handleSortChange = (sortValue) => {
    setSortValue(sortValue);
  };

  const handleTypeChange = (typeValue) => {
    setTypeValue(typeValue);
  };

  const handleLevelChange = (levelValue) => {
    setLevelValue(levelValue);
  };

  const handleClearAll = () => {
    setKeyword("");
    setCompanyKeyword("");
    setLocationKeyword("");
    setSortValue("relevance");
    setTypeValue("fullTime");
    setLevelValue("senior");
  };

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