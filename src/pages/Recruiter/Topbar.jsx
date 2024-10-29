import React, { useContext, useState } from "react";
import {
  Box,
  IconButton,
  useTheme,
  Typography,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Cookies from "js-cookie";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const openNotifications = Boolean(notificationAnchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove("userRole");
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    handleClose();
    window.location.reload();
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  // Example notifications
  const notifications = [
    "Thông báo 1: Bạn có một tin nhắn mới.",
    "Thông báo 2: Hẹn gặp bạn lúc 3 giờ chiều.",
    "Thông báo 3: Bạn đã được mời tham gia sự kiện.",
  ];

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
      {/* LOGO */}
      <Box display="flex" alignItems="center" gap={1}>
        <img
          src={`../../assets/logo.png`}
          alt="Sky Line Logo"
          style={{ height: "80px" }}
        />
        <Typography
          variant="h3"
          color="#19ADC8"
          fontWeight="bold"
          fontStyle="italic"
          sx={{
            textShadow: `1px 1px 2px ${colors.primary[400]}`,
            letterSpacing: "0.5px",
          }}
        >
          <strong>Dev</strong>Hunt
        </Typography>
      </Box>
      {/* ICONS */}
      <Box display="flex" alignItems="center">
        <IconButton onClick={colorMode.toggleColorMode} size="medium">
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        {/* Biểu tượng thông báo */}
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
            {notifications.map((notification, index) => (
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
          </Box>
        </Menu>

        <IconButton
          size="medium"
          onClick={handleClick}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <PersonOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
