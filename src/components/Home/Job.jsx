import React from "react";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import PaidIcon from "@mui/icons-material/Paid";

const Job = ({ searchResults, onJobClick }) => {
  return (
    <div className="jobContainer flex gap-10 justify-center flex-wrap items-center py-10">
      {Array.isArray(searchResults) && 
        searchResults.map((job) => (
          <div
            key={job.id}
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
                  {job.company?.name}
                </span>
                {job.company?.website && (
                  <span className="text-[12px] text-[#959595] group-hover:text-white">
                    {job.company.website}
                  </span>
                )}
              </div>
            </div>

            {/* Job Title & Category */}
            <div className="mb-4">
              <h1 className="text-[16px] font-semibold text-textColor group-hover:text-white">
                {job.title}
              </h1>
              <span className="text-[13px] text-[#959595] group-hover:text-white">
                {job.job_category?.title}
              </span>
            </div>

            {/* Location & Experience */}
            <div className="flex flex-col gap-2">
              <span className="flex items-center text-[#959595] gap-1 text-[13px] group-hover:text-white">
                <LocationOnIcon className="text-[16px]" />
                {job.location}
              </span>
              <span className="flex items-center text-[#959595] gap-1 text-[13px] group-hover:text-white">
                <WorkIcon className="text-[16px]" />
                {job.experience} • {job.level}
              </span>
              <span className="flex items-center text-[#959595] gap-1 text-[13px] group-hover:text-white">
                <PaidIcon className="text-[16px]" />
                {job.salary_range}
              </span>
            </div>

            {/* Skills & Description */}
            <div className="mt-4 border-t border-[#959595]/20 pt-4">
              <p className="text-[13px] text-[#959595] group-hover:text-white">
                Skills: {job.skill_required}
              </p>
              <p className="text-[13px] text-[#959595] group-hover:text-white mt-2 line-clamp-2">
                {job.description}
              </p>
            </div>

            {/* Benefits */}
            <div className="mt-4">
              <p className="text-[13px] text-[#959595] group-hover:text-white line-clamp-2">
                Benefits: {job.benefits}
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
        ))}
    </div>
  );
};

export default Job;
