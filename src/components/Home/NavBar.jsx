import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import Cookies from "js-cookie";
import Avatar from "@mui/material/Avatar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useSocket } from "../../contextAPI/socketProvider";

import {
  Box,
  IconButton,
  useTheme,
  Typography,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

const NavBar = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const openNotifications = Boolean(notificationAnchorEl);
  const [count, setCount] = useState(-2);
  const { message } = useSocket();
  const accessToken = Cookies.get("access_token");

  const [listMessage, setListMessage] = useState(() => {
    const savedMessages = Cookies.get('list_message');
    console.log(">>> " , savedMessages);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  useEffect(() => {
    if (message && message !== 'You are connected to Websocket') {
      setCount(prev => prev + 1);
  
      setListMessage(prev => {
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

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
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

        {accessToken ?
          <>
            {/* Biểu tượng thông báo */}
            <IconButton
              onClick={handleNotificationClick}
              size="medium"
              aria-controls={openNotifications ? "notification-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openNotifications ? "true" : undefined}
              className="relative"
            >
              {/* Notification Badge */}
              {count > 0 && (
                <div className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-cyan-500 rounded-full">
                  <span className="text-white text-xs">
                    {count > 99 ? '99+' : count}
                  </span>
                </div>
              )}
              
              {/* Notification Icon */}
              <NotificationsOutlinedIcon className="relative z-0" />
            </IconButton>
            
            <Menu
              anchorEl={notificationAnchorEl}
              id="notification-menu"
              open={openNotifications}
              onClose={handleNotificationClose}
              sx={{ minWidth: '300px' }} 
            >
              <Box sx={{ width: 400, padding: 2 }}>
                <Typography variant="h6" sx={{ padding: 1, fontWeight: 'bold' }}>Thông báo</Typography>
                <Divider />
                {listMessage.length > 0 ?
                  <>
                    {listMessage.map((notification, index) => (
                      <MenuItem 
                        key={index} 
                        onClick={handleNotificationClose}
                        sx={{ padding: 2 }} //khoảng cách giữa các thông báo
                      >
                        <Typography 
                          sx={{ 
                            whiteSpace: "normal", 
                            overflow: "visible", 
                            textOverflow: "clip", 
                            fontSize: '0.9rem', 
                          }}
                        >
                          {notification}
                        </Typography>
                      </MenuItem>
                    ))}
                  </>
                  :
                  <>
                    <MenuItem 
                        onClick={handleNotificationClose}
                        sx={{ padding: 2 }}
                      >
                        <Typography 
                          sx={{ 
                            whiteSpace: "normal", 
                            overflow: "visible", 
                            textOverflow: "clip", 
                            fontSize: '0.9rem', 
                          }}
                        >
                          No notification
                        </Typography>
                    </MenuItem>
                  </>
                }
              </Box>
            </Menu>
          </>
          :
          <></>
        }

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
