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
    onSortChange(event.target.value);
  };

  const handleTypeChange = (event) => {
    setTypeValue(event.target.value);
    onTypeChange(event.target.value);
  };

  const handleLevelChange = (event) => {
    setLevelValue(event.target.value);
    onLevelChange(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(searchKeyword);
    onCompanySearch(companyKeyword);
    onLocationSearch(locationKeyword);
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
            Sort by:
          </label>
          <select
            name="sort"
            id="sort"
            className=" bg-white rounded-[3px] px-4 py-1"
            value={sortValue}
            onChange={handleSortChange}
          >
            <option value="relevance">Relevance</option>
            <option value="inclusive">Inclusive</option>
            <option value="startWith">Start With</option>
            <option value="contains">Contains</option>
          </select>
        </div>

        <div className="singleSearch flex items-center gap-2">
          <label htmlFor="type" className=" text-[#808080] font-semibold">
            Type:
          </label>
          <select
            name="type"
            id="type"
            className=" bg-white rounded-[3px] px-4 py-1"
            value={typeValue}
            onChange={handleTypeChange}
          >
            <option value="fullTime">Full-Time</option>
            <option value="partTime">Part-Time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div className="singleSearch flex items-center gap-2">
          <label htmlFor="level" className=" text-[#808080] font-semibold">
            Level:
          </label>
          <select
            name="level"
            id="level"
            className=" bg-white rounded-[3px] px-4 py-1"
            value={levelValue}
            onChange={handleLevelChange}
          >
            <option value="senior">Senior</option>
            <option value="junior">Junior</option>
            <option value="fresher">Fresher</option>
            <option value="intern">Intern</option>
          </select>
        </div>
        <span className="text-[#a1a1a1] cursor-pointer" onClick={handleClearAll}>Clear All</span>
      </div>
    </div>
  );
};

export default Search;