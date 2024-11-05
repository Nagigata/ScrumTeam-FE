import React, { useContext, useState, useEffect } from "react";
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
import { useSocket } from "../../contextAPI/SocketProvider";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
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
            textShadow: '1px 1px 2px ${colors.primary[400]}',
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
        <IconButton size="medium">
          <NotificationsOutlinedIcon />
        </IconButton>
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