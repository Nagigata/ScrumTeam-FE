import React from "react";
import { useNavigate } from "react-router-dom";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const Job = ({ searchResults }) => {
  const navigate = useNavigate();
  console.log("Search Results:", searchResults); // Log kết quả tìm kiếm
  // Hàm để cắt bớt mô tả
  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  return (
    <div className="jobContainer flex gap-10 justify-center flex-wrap items-center py-10">
      {Array.isArray(searchResults) && searchResults.map((job) => {
        const {
          id,
          company,
          title,
          location,
          description,
          level,
          avatar_url,
        } = job;

        return (
          <div
            key={id}
            className="group group/item singleJob w-[270px] p-[20px] bg-white rounded-[10px] hover:bg-blueColor shadow-lg shadow-greyIsh-400/700 hover:shadow-lg"
            onClick={() => navigate(`/job/${id}`)}
          >
            <span className="flex justify-between items-center gap-4">
              <h1 className="text-[16px] font-semibold text-textColor group-hover:text-white">
                {title}
              </h1>
              <span className="flex items-center text-[#ccc] gap-1 text-[13px]">
                <AccessTimeOutlinedIcon />
                {company.founded_year}
              </span>
            </span>
            <h6 className="text-[#ccc]">{location}</h6>

            <p className="text-[13px] text-[#959595] pt-[20px] border-t-[2px] mt-[20px] group-hover:text-white h-[60px] overflow-hidden">
              {truncateDescription(description, 100)} {/* Giới hạn mô tả */}
            </p>
            <div className="company flex items-center gap-2">
              <img src={avatar_url} alt="Company Logo" className="w-[10%]" />
              <span className="text-[14px] py-[1rem] block group-hover:text-white">
                {company.name}
              </span>
            </div>

            <button className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-textColor hover:bg-white group-hover/item:text-textColor group-hover:text-textColor">
              Apply Now
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Job;
