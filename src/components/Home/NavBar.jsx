import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Cookies from "js-cookie";
import { Badge } from "@mui/material";
import NotificationDropdown from "./NotificationDropdown"; // Đảm bảo đường dẫn đúng
import { Avatar } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const NavBar = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const accessToken = Cookies.get("access_token");
  const navigate = useNavigate();

  const handleMarkAsRead = (notificationId) => {
    setUnreadCount(Math.max(0, unreadCount - 1));
    // Here you would typically make an API call to update the notification status
  };

  useEffect(() => {
    if (accessToken) {
      fetchUserProfile(accessToken);
    }
  }, [accessToken]);

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/candidate/basic-profile/",
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
          console.error("Unauthorized request");
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
    navigate("/");
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

        {accessToken ? (
          <>
            <li className="navBarLi relative">
              <div
                className="cursor-pointer p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon className="text-gray-600" />
                </Badge>
              </div>
              <NotificationDropdown
                show={showNotifications}
                onMarkAsRead={handleMarkAsRead}
              />
            </li>
            <li
              className="navBarLi relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div className="flex items-center cursor-pointer">
                <Avatar src={userProfile?.avatar} className="mr-2">
                  {userProfile?.full_name?.charAt(0).toUpperCase()}
                </Avatar>
                <span>{userProfile?.full_name}</span>
                <ArrowDropDownIcon />
              </div>
              {showDropdown && (
                <ul className="absolute top-full right-0 bg-white shadow-md rounded-md py-2 w-40 z-10">
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link to="/basic-profile">Profile</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link to="/advanced-profile">DevHunt Profile</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link to="/cv-management">CV Management</Link>
                    <Link to="/following-job">Following Job</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link to="/following-job">Following Job</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link to="/application-status">My Application</Link>
                    <Link to="/skills">Portfolio</Link>
                    <Link to="/cv-management">CV Management</Link>
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
