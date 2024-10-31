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
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const openNotifications = Boolean(notificationAnchorEl);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const { message } = useSocket() || {};
  const accessToken = Cookies.get("access_token");

  const [listMessage, setListMessage] = useState(() => {
    const savedMessages = Cookies.get("list_message");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  useEffect(() => {
    if (message && message !== "You are connected to Websocket") {
      setCount((prev) => prev + 1);
      setListMessage((prev) => {
        const newList = [...prev, message];
        Cookies.set("list_message", JSON.stringify(newList));
        return newList;
      });
    }
  }, [message]);

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
    setCount(0); 
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const clearNotifications = () => {
    setListMessage([]); 
    Cookies.remove("list_message"); 
    setCount(0); 
  };

  const handleNotificationItemClick = (notification) => {
    try {
      const { jobId } = JSON.parse(notification);
      if (jobId) {
        navigate(`/job/${jobId}/candidates`); // Điều hướng đến trang danh sách ứng viên của job
      }
    } catch (e) {
      console.error("Thông báo không có thông tin jobId hợp lệ:", e);
    }
    handleNotificationClose();
  };

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

        {accessToken ? (
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
                    {count > 99 ? "99+" : count}
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
              sx={{ minWidth: "300px" }}
            >
              <Box sx={{ width: 400, padding: 2 }}>
                <Typography variant="h6" sx={{ padding: 1, fontWeight: "bold" }}>
                  Notification
                </Typography>
                <Divider />
                
                {listMessage.length > 0 ? (
                  listMessage.map((notification, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => handleNotificationItemClick(notification)}
                      sx={{ padding: 2 }}
                    >
                      <Typography
                        sx={{
                          whiteSpace: "normal",
                          overflow: "visible",
                          textOverflow: "clip",
                          fontSize: "0.9rem",
                        }}
                      >
                        {notification}
                      </Typography>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem onClick={handleNotificationClose} sx={{ padding: 2 }}>
                    <Typography
                      sx={{
                        whiteSpace: "normal",
                        overflow: "visible",
                        textOverflow: "clip",
                        fontSize: "0.9rem",
                      }}
                    >
                      No notification
                    </Typography>
                  </MenuItem>
                )}

                {listMessage.length > 0 && (
                  <>
                    <Divider sx={{ marginY: 1 }} />
                    <MenuItem 
                      onClick={clearNotifications} 
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        backgroundColor: "#f8d7da",
                        color: "#d9534f",
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: "#f5c6cb",
                          color: "#c9302c",
                        },
                        padding: 1.5,
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">Xóa tất cả thông báo</Typography>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Menu>
          </>
        ) : (
          <></>
        )}

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
