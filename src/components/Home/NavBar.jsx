import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import Cookies from "js-cookie";
import Avatar from "@mui/material/Avatar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const NavBar = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      fetchUserProfile(accessToken);
    }
  }, []);

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/candidate/profile/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      } else {
        console.error("Failed to fetch user profile");
        if (response.status === 401) {
          Cookies.remove("userRole");
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("userRole");
    setUserProfile(null);
    window.location.reload();
  };

  return (
    <div className="navBar flex justify-between items-center p-[2rem]">
      <div className="logoDiv">
        <h1 className="logo text-[25px] text-blueColor">
          <strong>Dev</strong>Hunt
        </h1>
      </div>

      <div className="menu flex gap-8 items-center">
        <li className="navBarLi">
          <Link to="/">Home</Link>
        </li>
        <li className="navBarLi">Jobs</li>
        <li className="navBarLi">Companies</li>
        <li className="navBarLi">Contact</li>

        {userProfile ? (
          <>
            <li
              className="navBarLi relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div className="flex items-center cursor-pointer">
                <Avatar src={userProfile.avatar} className="mr-2">
                  {userProfile.full_name.charAt(0).toUpperCase()}
                </Avatar>
                <span>{userProfile.full_name}</span>
                <ArrowDropDownIcon />
              </div>
              {showDropdown && (
                <ul className="absolute top-full right-0 bg-white shadow-md rounded-md py-2 w-40 z-10">
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link to="/candidate">Profile</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link to="/application-status">My Application</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 hover:text-red-500">
                    <button onClick={handleLogout}>
                      Logout
                      <LoginOutlinedIcon className="ml-4" />
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </>
        ) : (
          <>
            <li className="navBarLi">
              <Link to="/login">Login</Link>
            </li>
            <li className="navBarLi">
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
