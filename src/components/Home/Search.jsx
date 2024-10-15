import React, { useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const Search = ({ onSearch, onCompanySearch, onLocationSearch, onSortChange, onTypeChange, onLevelChange, onClearAll }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [companyKeyword, setCompanyKeyword] = useState("");
  const [locationKeyword, setLocationKeyword] = useState("");
  const [sortValue, setSortValue] = useState("relevance");
  const [typeValue, setTypeValue] = useState("fullTime");
  const [levelValue, setLevelValue] = useState("senior");

  const handleInputChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleCompanyInputChange = (event) => {
    setCompanyKeyword(event.target.value);
  };

  const handleLocationInputChange = (event) => {
    setLocationKeyword(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortValue(event.target.value);
    onSortChange(event.target.value); // Gọi onSortChange với kỹ năng mới
  };

  const handleTypeChange = (event) => {
    setTypeValue(event.target.value);
    onTypeChange(event.target.value);
  };

  const handleLevelChange = (event) => {
    setLevelValue(event.target.value);
    onLevelChange(event.target.value); // Gọi onLevelChange với mức lương mới
  };

  const handleSearch = (event) => {
    event.preventDefault();
    console.log("Search Keyword:", searchKeyword); // Log từ khóa tìm kiếm
    onSearch(searchKeyword);
  };

  const handleClearAll = () => {
    setSearchKeyword("");
    setCompanyKeyword("");
    setLocationKeyword("");
    setSortValue("relevance");
    setTypeValue("fullTime");
    setLevelValue("senior");
    onSearch("");
    onCompanySearch("");
    onLocationSearch("");
    onSortChange("relevance");
    onTypeChange("fullTime");
    onLevelChange("senior");
    onClearAll();
  };

  const handleLocationChange = (event) => {
    setLocationKeyword(event.target.value);
    onLocationSearch(event.target.value); // Gọi onLocationSearch với địa điểm mới
  };

  return (
    <div className="searchDiv grid gap-10 bg-greyIsh rounded-[10px] p-[3rem]">
      <form onSubmit={handleSearch}>
        <div className="firstDiv flex justify-between items-center rounded-[8px] gap-[10px] bg-white p-5 shadow-lg shadow-greyIsh-700">
          <div className="flex gap-2 items-center">
            <SearchOutlinedIcon className="text-[25px] icon" />
            <input
              type="text"
              className="bg-transparent text-[#535ac8] focus:outline-none w-[100%]"
              placeholder="Search Job Here...."
              value={searchKeyword}
              onChange={handleInputChange}
            />
            <HighlightOffOutlinedIcon className="text-[30px] text-[#a5a6a6] hover:text-textColor icon" />
          </div>

          <div className="flex gap-2 items-center">
            <BusinessOutlinedIcon className="text-[25px] icon" />
            <input
              type="text"
              className="bg-transparent text-[#535ac8] focus:outline-none w-[100%]"
              placeholder="Search by company...."
              value={companyKeyword}
              onChange={handleCompanyInputChange}
            />
            <HighlightOffOutlinedIcon className="text-[30px] text-[#a5a6a6] hover:text-textColor icon" />
          </div>

          <div className="flex gap-2 items-center">
            <LocationOnOutlinedIcon className="text-[25px] icon" />
            <input
              type="text"
              className="bg-transparent text-[#535ac8] focus:outline-none w-[100%]"
              placeholder="Search by location...."
              value={locationKeyword}
              onChange={handleLocationInputChange}
            />
            <HighlightOffOutlinedIcon className="text-[30px] text-[#a5a6a6] hover:text-textColor icon" />
          </div>

          <button className="bg-blueColor h-full p-5 px-10 rounded-[10px] text-white cursor-pointer hover:bg-[#535ac8]">
            Search
          </button>
        </div>
      </form>
      <div className="secDiv flex items-center gap-10 justify-center">
        <div className="singleSearch flex items-center gap-2">
          <label htmlFor="relevance" className=" text-[#808080] font-semibold">
            Skill:
          </label>
          <select
            name="sort"
            id="sort"
            className=" bg-white rounded-[3px] px-4 py-1"
            value={sortValue}
            onChange={handleSortChange} // Sử dụng handleSortChange
          >
            <option value=""></option>
            <option value="Python">Python</option>
            <option value="Django">Django</option>
          </select>
        </div>

        <div className="singleSearch flex items-center gap-2">
          <label htmlFor="type" className=" text-[#808080] font-semibold">
            Location:
          </label>
          <select
            name="type"
            id="type"
            className=" bg-white rounded-[3px] px-4 py-1"
            value={typeValue}
            onChange={handleLocationChange} // Sử dụng handleLocationChange
          >
            <option value=""></option>
            <option value="TPHCM">TPHCM</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Hà Nội">Hà Nội</option>
          </select>
        </div>

        <div className="singleSearch flex items-center gap-2">
          <label htmlFor="salary" className=" text-[#808080] font-semibold">
            Salary:
          </label>
          <select
            name="salary"
            id="salary"
            className=" bg-white rounded-[3px] px-4 py-1"
            value={levelValue}
            onChange={handleLevelChange}
          >
            <option value=""></option>
            <option value="1000">1000</option>
            <option value="1500">1500</option>
            <option value="2000">2000</option>
            <option value="2500">2500</option>
          </select>
        </div>
        <span className="text-[#a1a1a1] cursor-pointer" onClick={handleClearAll}>Clear All</span>
      </div>
    </div>
  );
};

export default Search;
