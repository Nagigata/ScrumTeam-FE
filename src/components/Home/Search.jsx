import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const Search = () => {
  return (
    <div className="searchDiv grid gap-10 bg-greyIsh rounded-[10px] p-[3rem]">
      <form action="">
        <div className="firstDiv flex justify-between items-center rounded-[8px] gap-[10px] bg-white p-5 shadow-lg shadow-greyIsh-700">
          <div className="flex gap-2 items-center">
            <SearchOutlinedIcon className="text-[25px] icon" />
            <input
              type="text"
              className="bg-transparent text-[#535ac8] focus:outline-none w-[100%]"
              placeholder="Search Job Here...."
            />
            <HighlightOffOutlinedIcon className="text-[30px] text-[#a5a6a6] hover:text-textColor icon" />
          </div>

          <div className="flex gap-2   items-center">
            <BusinessOutlinedIcon className="text-[25px] icon" />
            <input
              type="text"
              className="bg-transparent text-[#535ac8] focus:outline-none w-[100%]"
              placeholder="Search by company...."
            />
            <HighlightOffOutlinedIcon className="text-[30px] text-[#a5a6a6] hover:text-textColor icon" />
          </div>

          <div className="flex gap-2 items-center">
            <LocationOnOutlinedIcon className="text-[25px] icon" />
            <input
              type="text"
              className="bg-transparent text-[#535ac8] focus:outline-none w-[100%]"
              placeholder="Search by location...."
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
            name=""
            id="relevance"
            className=" bg-white rounded-[3px] px-4 py-1"
          >
            <option value="">Relevance</option>
            <option value="">Inclusive</option>
            <option value="">Start With</option>
            <option value="">Contains</option>
          </select>
        </div>

        <div className="singleSearch flex items-center gap-2">
          <label htmlFor="type" className=" text-[#808080] font-semibold">
            Type:
          </label>
          <select
            name=""
            id="type"
            className=" bg-white rounded-[3px] px-4 py-1"
          >
            <option value="">Full-Time</option>
            <option value="">Part-Time</option>
            <option value="">Contract</option>
          </select>
        </div>

        <div className="singleSearch flex items-center gap-2">
          <label htmlFor="level" className=" text-[#808080] font-semibold">
            Level:
          </label>
          <select
            name=""
            id="level"
            className=" bg-white rounded-[3px] px-4 py-1"
          >
            <option value="">Senior</option>
            <option value="">Junior</option>
            <option value="">Fresher</option>
            <option value="">Intern</option>
          </select>
        </div>
        <span className="text-[#a1a1a1] cursor-pointer">Clear All</span>
      </div>
    </div>
  );
};

export default Search;
