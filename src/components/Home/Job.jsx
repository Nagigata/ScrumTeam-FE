import React from "react";
import { useNavigate } from "react-router-dom";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const Data = [
  {
    id: 1,
    image: "/assets/companyLogo/facebook.png",
    title: "Web Developer ",
    time: "3 Days",
    location: "Menlo Park",
    desc: "Work on the development of core social media features.",
    company: "Facebook",
    type: "fullTime",
    level: "senior",
  },
  {
    id: 2,
    image: "/assets/companyLogo/github.png",
    title: "DevOps Engineer",
    time: "5 Days",
    location: "Remote",
    desc: "Help automate our infrastructure and ensure smooth CI/CD pipelines.",
    company: "GitHub",
    type: "fullTime",
    level: "junior",
  },
  {
    id: 3,
    image: "/assets/companyLogo/instagram.png",
    title: "Frontend Developer",
    time: "2Hrs",
    location: "New York",
    desc: "Develop and maintain user-facing features for Instagram web and mobile apps.",
    company: "Instagram",
    type: "partTime",
    level: "fresher",
  },
  {
    id: 4,
    image: "/assets/companyLogo/messenger.png",
    title: "Mobile App Developer",
    time: "1Hrs",
    location: "Remote",
    desc: "Build and optimize mobile applications for Messenger.",
    company: "Messenger",
    type: "contract",
    level: "intern",
  },
  {
    id: 5,
    image: "/assets/companyLogo/pinterest.png",
    title: "Product Designer",
    time: "Now",
    location: "San Francisco",
    desc: "Design user experiences for Pinterest’s visual discovery platform.",
    company: "Pinterest",
    type: "fullTime",
    level: "senior",
  },
  {
    id: 6,
    image: "/assets/companyLogo/reddit.png",
    title: "Backend Engineer",
    time: "14Hrs",
    location: "San Francisco",
    desc: "Work on high-scale backend systems powering Reddit’s platform.",
    company: "Reddit",
    type: "fullTime",
    level: "junior",
  },
  {
    id: 7,
    image: "/assets/companyLogo/soundcloud.png",
    title: "Security Engineer",
    time: "6 Days",
    location: "Austin",
    desc: "Focus on security infrastructure and ensure network reliability.",
    company: "Cloudflare",
    type: "partTime",
    level: "fresher",
  },
  {
    id: 8,
    image: "/assets/companyLogo/spotify.png",
    title: "Data Scientist",
    time: "2 Days",
    location: "Stockholm",
    desc: "Analyze user data to enhance music recommendations and discovery.",
    company: "Spotify",
    type: "contract",
    level: "intern",
  },
  {
    id: 9,
    image: "/assets/companyLogo/whatsapp.png",
    title: "QA Engineer",
    time: "3 Days",
    location: "Mountain View",
    desc: "Test new features and ensure quality for the WhatsApp messaging app.",
    company: "WhatsApp",
    type: "fullTime",
    level: "senior",
  },
];

const Job = ({ keyword, companyKeyword, locationKeyword, sortValue, typeValue, levelValue }) => {
  const navigate = useNavigate();
  let filteredJobs = Data.filter((job) =>
    job.title.toLowerCase().includes(keyword.toLowerCase()) &&
    job.company.toLowerCase().includes(companyKeyword.toLowerCase()) &&
    job.location.toLowerCase().includes(locationKeyword.toLowerCase()) &&
    job.type === typeValue &&
    job.level === levelValue
  );

  // Nếu tất cả các giá trị tìm kiếm và sắp xếp là mặc định, hiển thị tất cả các công việc
  if (
    keyword === "" &&
    companyKeyword === "" &&
    locationKeyword === "" &&
    sortValue === "relevance" &&
    typeValue === "fullTime" &&
    levelValue === "senior"
  ) {
    filteredJobs = Data;
  }

  // Logic sắp xếp
  switch (sortValue) {
    case "inclusive":
      filteredJobs = filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "startWith":
      filteredJobs = filteredJobs.sort((a, b) => a.title.startsWith(keyword) ? -1 : 1);
      break;
    case "contains":
      filteredJobs = filteredJobs.sort((a, b) => a.title.includes(keyword) ? -1 : 1);
      break;
    default:
      break;
  }

  return (
    <div>
      <div className="jobContainer flex gap-10 justify-center flex-wrap items-center py-10">
        {filteredJobs.map(({ id, image, title, time, location, desc, company }) => {
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
                  {time}
                </span>
              </span>
              <h6 className="text-[#ccc]">{location}</h6>

              <p
                className="text-[13px] text-[#959595] pt-[20px] 
              border-t-[2px] mt-[20px] group-hover:text-white"
              >
                {desc}
              </p>
              <div className="company flex items-center gap-2">
                <img src={image} alt="Company Logo" className="w-[10%]" />
                <span className="text-[14px] py-[1rem] block group-hover:text-white">
                  {company}
                </span>
              </div>

              <button
                className="border-[2px] rounded-[10px] block p-[10px] w-full 
              text-[14px] font-semibold text-textColor 
              hover:bg-white ☐ group-hover/item:text-textColor group-hover:text-textColor"
              >
                Apply Now
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Job;