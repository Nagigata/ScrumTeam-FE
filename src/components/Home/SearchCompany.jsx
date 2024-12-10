import React, { useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

const SearchCompany = ({ onSearch }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [location, setLocation] = useState("All"); 

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchKeyword} in ${location}`);
  };

  const locationOptions = [
    "All", 
    "Hanoi",
    "Ho Chi Minh City",
    "Da Nang",
    "Can Tho",
    "Hai Phong",
  ];

  const handleClearSearch = () => {
    setSearchKeyword("");
    setLocation("All");
  };

  return (
    <div className="max-w-6xl mx-auto bg-greyIsh rounded-[10px] p-[3rem]">
      <form onSubmit={handleSubmit} className="flex w-full">
        <div className="flex-1 flex border justify-between items-center pr-5 border-gray-300 rounded-l-[8px] bg-white shadow-lg shadow-greyIsh-700">
          <div className="flex items-center p-5">
            <SearchOutlinedIcon size={25} />
          </div>
          <input
            type="text"
            className="w-full py-3 px-2 focus:outline-none text-gray-600 placeholder-gray-400"
            placeholder="Enter Company Name..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          {searchKeyword && (
            <HighlightOffOutlinedIcon
              className="text-[30px] text-[#a5a6a6] hover:text-textColor icon cursor-pointer"
              onClick={handleClearSearch}
            />
          )}
        </div>

        <div className="w-48 border-y border-gray-300 bg-white shadow-lg shadow-greyIsh-700">
          <select
            className="w-full h-full px-4 focus:outline-none text-gray-600 bg-transparent cursor-pointer"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {locationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="px-8 bg-blueColor text-white font-medium rounded-r-[8px] hover:bg-[#535ac8] transition-colors shadow-lg shadow-greyIsh-700"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchCompany;
