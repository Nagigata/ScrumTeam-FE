import React from "react";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <div>
      <div
        className="footer p-[4rem] mb-4 bg-blueColor rounded-[10px] gap-8 grid
      grid-cols-5 m-auto items-center justify-center"
      >
        <div>
          <div className="logoDiv">
            <h1 className="logo text-[25px] text-white pb-[1.5rem]">
              <strong>Dev</strong>Hunt
            </h1>
          </div>

          <p className="text-white pb-[13px] opacity-70 leading-7">
            We always make our seekers and companies find the best jobs and
            employers find the best candidates.
          </p>
        </div>
        <div className="grid">
          <span className="divTitle text-[18px] font-semibold pb-[1.5rem] text-white">
            Company
          </span>
          <div className="grid gap-3">
            <li className="text-white opacity-[.7] hover:opacity-[1]">
              About Us
            </li>
            <li className="text-white opacity-[.7] hover:opacity-[1]">
              Features
            </li>
            <li className="text-white opacity-[.7] hover:opacity-[1]">News</li>
            <li className="text-white opacity-[.7] hover:opacity-[1]">FAQ</li>
          </div>
        </div>

        <div className="grid">
          <span className="divTitle text-[18px] font-semibold pb-[1.5rem] text-white">
            Services
          </span>
          <div className="grid gap-3">
            <li className="text-white opacity-[.7] hover:opacity-[1]">
              Job Listings
            </li>
            <li className="text-white opacity-[.7] hover:opacity-[1]">
              Resume Building
            </li>
            <li className="text-white opacity-[.7] hover:opacity-[1]">
              Career Counseling
            </li>
            <li className="text-white opacity-[.7] hover:opacity-[1]">
              Interview Preparation
            </li>
          </div>
        </div>

        <div className="grid">
          <span className="divTitle text-[18px] font-semibold pb-[1.5rem] text-white">
            Resources
          </span>
          <div className="grid gap-3">
            <li className="text-white opacity-[.7] hover:opacity-[1]">Blog</li>
            <li className="text-white opacity-[.7] hover:opacity-[1]">
              Help Center
            </li>
            <li className="text-white opacity-[.7] hover:opacity-[1]">
              Contact Us
            </li>
            <li className="text-white opacity-[.7] hover:opacity-[1]">
              Careers
            </li>
          </div>
        </div>

        <div className="grid">
          <span className="divTitle text-[18px] font-semibold pb-[1.5rem] text-white">
            Contact Info
          </span>
          <div>
            <small className="text-[14px] text-white">
              devhunt@gmail.com
            </small>
            <div className="icons flex gap-5 py-[2rem]">
              <FacebookOutlinedIcon
                className="bg-white p-[5px] rounded-full icon text-blueColor"
                style={{ fontSize: "35px" }}
              />
              <XIcon
                className="bg-white p-[5px] rounded-full icon text-blueColor"
                style={{ fontSize: "35px" }}
              />
              <InstagramIcon
                className="bg-white p-[5px] rounded-full icon text-blueColor"
                style={{ fontSize: "35px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
