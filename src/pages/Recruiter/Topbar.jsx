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
  const openNotifications = Boolean(notificationAnchorEl);
  const [count, setCount] = useState(0);
  const { message, setURL } = useSocket();
  const accessToken = Cookies.get("access_token");

  useEffect(() => {
    setURL('new_application')
  }, []);

  const [listMessage, setListMessage] = useState(() => {
    const savedMessages = Cookies.get("list_message");
    console.log(">>> ", savedMessages);
    return savedMessages ? JSON.parse(savedMessages).reverse() : [];  // Đảo ngược thông báo khi lấy từ cookies
  });

  useEffect(() => {
    if (message && message !== "You are connected to Websocket") {
      setCount((prev) => prev + 1);
  
      setListMessage((prev) => {
        // Thêm thông báo mới vào đầu mảng
        const newList = [message, ...prev];
  
        // Lưu danh sách thông báo vào cookies
        const storedMessages = Cookies.get("list_message");
        const parsedMessages = storedMessages ? JSON.parse(storedMessages) : [];
        if (JSON.stringify(parsedMessages) !== JSON.stringify(newList)) {
          Cookies.set("list_message", JSON.stringify(newList));  // Lưu lại thông báo mới nhất
        }
  
        return newList;
      });
      console.log("CHECK: ", message);
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

    // Reset số lượng thông báo chưa đọc khi mở menu
    setCount(0);
    // Xóa hết thông báo trong cookies
    Cookies.remove("list_message");

  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
    >
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
              aria-controls={
                openNotifications ? "notification-menu" : undefined
              }
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
                <Typography
                  variant="h6"
                  sx={{ padding: 1, fontWeight: "bold" }}
                >
                  Notification
                </Typography>
                <Divider />
                {listMessage.length > 0 ? (
                  <>
                  {listMessage.map((notification, index) => {
                    // Tách chuỗi thời gian từ notification
                    const rawTime = notification.substring(notification.lastIndexOf("/time:") + 6); // Bỏ "/time:" ra
                    // Tách ngày giờ từ rawTime
                    const [date, time] = rawTime.split(" "); // Phân tách "2024-12-10" và "18:17:51"
                    const [year, month, day] = date.split("-"); // Tách "2024", "12", "10"
                    const [hour, minute] = time.split(":"); // Tách "18", "17"

                    // Định dạng thời gian theo 12/10/2024 18:17
                    const formattedTime = `${month}/${day}/${year} ${hour}:${minute}`;

                    return (
                      <MenuItem
                        key={index}
                        onClick={handleNotificationClose}
                        sx={{ padding: 2 }} // Khoảng cách giữa các thông báo
                      >
                        <Typography
                          sx={{
                            whiteSpace: "normal",
                            overflow: "visible",
                            textOverflow: "clip",
                            fontSize: "0.9rem",
                          }}
                        >
                          {notification.split("/")[0]}
                          <p className="text-xs text-gray-500 mt-1">
                            {formattedTime}
                          </p>
                        </Typography>
                      </MenuItem>
                    );
                  })}
                  </>
                ) : (
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
                          fontSize: "0.9rem",
                        }}
                      >
                        No notification
                      </Typography>
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
