import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Cookies from "js-cookie";
import { Badge, IconButton } from "@mui/material";
import NotificationDropdown from "./NotificationDropdown"; // Đảm bảo đường dẫn đúng
import { Avatar } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useSocket } from "../../contextAPI/SocketProvider";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

const NavBar = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [count, setCount] = useState(0);
  const { message } = useSocket();

  const accessToken = Cookies.get("access_token");
  const navigate = useNavigate();
  
  const [listMessage, setListMessage] = useState(() => {
    const savedMessages = Cookies.get("list_message");
    // console.log(">>> ", savedMessages);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  useEffect(() => {
    if (accessToken) {
      fetchUserProfile(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (message && message !== "You are connected to Websocket") {
      setCount((prev) => prev + 1);

      setListMessage((prev) => {
        const newList = [...prev, message];

        const storedMessages = Cookies.get("list_message");
        const parsedMessages = storedMessages ? JSON.parse(storedMessages) : [];

        if (JSON.stringify(parsedMessages) !== JSON.stringify(newList)) {
          Cookies.set("list_message", JSON.stringify(newList));
        }

        return newList;
      });
    }
  }, [message]);

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

  const handleClick = () => {
    setShowNotifications(!showNotifications);
    console.log(count);
  }

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
            <IconButton
              onClick={() => handleClick()}
              size="medium"
              className="relative"
            >
              {/* Notification Badge */}
              {count > 0 && (
                <div className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-cyan-500 rounded-full">
                  <span className="text-white text-xs">
                    {count > 99 ? "99+" : count}
                  </span>
                </div>
              )}

              {/* Notification Icon */}
              <NotificationsOutlinedIcon className="relative z-0" />
            </IconButton>
              <NotificationDropdown show={showNotifications} />
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
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link to="/following-job">Following Job</Link>
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
