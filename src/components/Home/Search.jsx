import React, { useState, useEffect } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useNavigate, useLocation } from "react-router-dom";

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
  showFilters = true
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [searchKeyword, setSearchKeyword] = useState("");
  const [companyKeyword, setCompanyKeyword] = useState("");
  const [locationKeyword, setLocationKeyword] = useState("");
  const [salaryRanges, setSalaryRanges] = useState([]);

  // Định nghĩa locations cố định
  const predefinedLocations = [
    { id: "", name: "Tất cả" },
    { id: "Hà Nội", name: "Hà Nội" },
    { id: "Hồ Chí Minh", name: "Hồ Chí Minh" },
    { id: "Đà Nẵng", name: "Đà Nẵng" }
  ];

  // Fetch salary ranges when component mounts
  useEffect(() => {
    fetchSalaryRanges();
  }, []);

  const fetchSalaryRanges = async () => {
    try {
      const response = await fetch('http://cnpm.duytech.site/api/options/get_all_salary_ranges/');
      if (response.ok) {
        const data = await response.json();
        setSalaryRanges(data);
      } else {
        console.error('Failed to fetch salary ranges');
      }
    } catch (error) {
      console.error('Error fetching salary ranges:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (isHomePage) {
      navigate('/jobs', {
        state: {
          searchKeyword,
          companyKeyword,
          locationKeyword,
          selectedFilters
        }
      });
    } else {
      onSearch(searchKeyword);
    }
  };

  const handleClear = () => {
    setSearchKeyword("");
    setCompanyKeyword("");
    setLocationKeyword("");
    onClearAll();
  };

  return (
    <div className="searchDiv grid gap-10 bg-greyIsh rounded-[10px] p-[3rem]">
      <form onSubmit={handleSubmit}>
        <div className="firstDiv flex justify-between items-center rounded-[8px] gap-[10px] bg-white p-5 shadow-lg shadow-greyIsh-700">
          <div className="flex gap-2 items-center">
            <SearchOutlinedIcon className="text-[25px] icon" />
            <input
              type="text"
              className="bg-transparent text-[#535ac8] focus:outline-none w-full max-w-[1000px] min-w-[200px]"
              placeholder="Search Here...."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <HighlightOffOutlinedIcon 
              className="text-[30px] text-[#a5a6a6] hover:text-textColor icon cursor-pointer" 
              onClick={() => setSearchKeyword("")}
            />
          </div>

          <button className="bg-blueColor h-full p-5 px-10 rounded-[10px] text-white cursor-pointer hover:bg-[#535ac8]">
            Search
          </button>
        </div>
      </form>

      {showFilters && (
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
                <option 
                  key={skillItem.id} 
                  value={skillItem.skill.toLowerCase()}
                >
                  {skillItem.skill}
                </option>
              ))}
            </select>
          </div>

          <span
            className="text-[#a1a1a1] cursor-pointer"
            onClick={onClearAll}
          >
            Clear All
          </span>
        </div>
      )}
    </div>
  );
};

export default Search;
