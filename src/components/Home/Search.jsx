import React, { useState, useEffect } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import provinces from '../../provinces.json';

const Search = ({
  onSearch,
  onCompanySearch,
  onLocationSearch,
  onSortChange,
  onTypeChange,
  onLevelChange,
  onClearAll,
  filterOptions = {},
  selectedFilters = {},
  showFilters = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [searchKeyword, setSearchKeyword] = useState("");
  const [companyKeyword, setCompanyKeyword] = useState("");
  const [locationKeyword, setLocationKeyword] = useState("");
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [searchType, setSearchType] = useState("jobs");

  const searchTypeOptions = [
    { value: "jobs", label: "Search Jobs" },
    { value: "companies", label: "Search Companies" }
  ];

  // Định nghĩa locations cố định
  const predefinedLocations = [
    { id: "", name: "All Location" },
    ...provinces
  ];
  

  // Fetch salary ranges when component mounts
  useEffect(() => {
    fetchSalaryRanges();
  }, []);

  const fetchSalaryRanges = async () => {
    try {
      const response = await fetch(
        "http://cnpm.duytech.site/api/options/get_all_salary_ranges/"
      );
      if (response.ok) {
        const data = await response.json();
        setSalaryRanges(data);
      } else {
        console.error("Failed to fetch salary ranges");
      }
    } catch (error) {
      console.error("Error fetching salary ranges:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isHomePage) {
      navigate("/jobs", {
        state: {
          searchKeyword,
          searchType,
          selectedFilters,
        },
      });
    } else {
      if (searchType === "jobs") {
        onSearch(searchKeyword);
      } else {
        onCompanySearch(searchKeyword);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setSearchType("jobs");
  };

  return (
    <div className="max-w-6xl mx-auto grid gap-10 bg-greyIsh rounded-[10px] p-[3rem]">
      <form onSubmit={handleSubmit}>
        <div className="flex w-full">
          <div className="flex-1 flex border justify-between items-center pr-5 border-gray-300 rounded-l-[8px] bg-white shadow-lg shadow-greyIsh-700">
            <div className="flex items-center p-5">
              <SearchOutlinedIcon size={25} />
            </div>
            <input
              type="text"
              className="w-full py-3 px-2 focus:outline-none text-gray-600 placeholder-gray-400"
              placeholder={searchType === "jobs" ? "Search Jobs Here..." : "Enter Company Name..."}
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

          {!showFilters && (
            <>
              <div className="w-52 border-y border-gray-300 bg-white shadow-lg shadow-greyIsh-700">
                <select
                  className="w-full h-full px-4 focus:outline-none text-gray-600 bg-transparent cursor-pointer"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  {searchTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
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
            </>
          )}

         {showFilters && (
            <button
              type="submit"
              className="px-8 bg-blueColor text-white font-medium rounded-r-[8px] hover:bg-[#535ac8] transition-colors shadow-lg shadow-greyIsh-700"
            >
              Search
            </button>
          )}
        </div>
      </form>

      {showFilters && searchType === "jobs" && (
        <div className="secDiv flex items-center gap-10 justify-center">
          <div className="singleSearch flex items-center gap-2">
            <label htmlFor="location" className="text-[#808080] font-semibold">
              Location:
            </label>
            <select
              value={selectedFilters.location || ""}
              onChange={(e) => onLocationSearch(e.target.value)}
              className="bg-white rounded-[3px] px-4 py-1"
            >
              {predefinedLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="singleSearch flex items-center gap-2">
            <label htmlFor="salary" className="text-[#808080] font-semibold">
              Salary:
            </label>
            <select
              value={selectedFilters.salary || ""}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-white rounded-[3px] px-4 py-1"
            >
              <option value="">All Salaries</option>
              {filterOptions.salaryRanges?.map((salary) => (
                <option key={salary.id} value={salary.id}>
                  {salary.salary_range}
                </option>
              ))}
            </select>
          </div>

          <div className="singleSearch flex items-center gap-2">
            <label htmlFor="skill" className="text-[#808080] font-semibold">
              Skill:
            </label>
            <select
              value={selectedFilters.skill || ""}
              onChange={(e) => onTypeChange(e.target.value)}
              className="bg-white rounded-[3px] px-4 py-1"
            >
              <option value="">All Skills</option>
              {filterOptions.skills?.map((skillItem) => (
                <option key={skillItem.id} value={skillItem.skill.toLowerCase()}>
                  {skillItem.skill}
                </option>
              ))}
            </select>
          </div>

          <span className="text-[#a1a1a1] cursor-pointer" onClick={onClearAll}>
            Clear All
          </span>
        </div>
      )}
    </div>
  );
};

export default Search;
