import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Menu, MenuItem, Divider } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Cookies from "js-cookie";

const NotificationMenu = () => {
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const openNotifications = Boolean(notificationAnchorEl);

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const apiURL = "http://cnpm.duytech.site/api/job/notifications_job/";
      const accessToken = Cookies.get("access_token");

      try {
        const response = await fetch(apiURL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Box>
      <IconButton
        size="medium"
        onClick={handleNotificationClick}
        aria-controls={openNotifications ? "notification-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openNotifications ? "true" : undefined}
      >
        <NotificationsOutlinedIcon />
      </IconButton>
      <Menu
        anchorEl={notificationAnchorEl}
        id="notification-menu"
        open={openNotifications}
        onClose={handleNotificationClose}
        sx={{ minWidth: '300px' }}
      >
        <Box sx={{ width: 400, padding: 2 }}>
          <Typography variant="h4" sx={{ padding: 1, fontWeight: 'bold' }}>Thông báo</Typography>
          <Divider />
          {notifications.map((notification) => (
            <MenuItem 
              key={notification.id} 
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
                {notification.message}
              </Typography>
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
  );
};

export default NotificationMenu;
