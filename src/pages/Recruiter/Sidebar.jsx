import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Tooltip,
  Dialog,
} from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PostAddIcon from "@mui/icons-material/PostAdd";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import Company from "./../ProfileManage/Company";

const Item = ({ title, to, icon, selected, setSelected, isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Tooltip title={isCollapsed ? title : ""} placement="right">
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
        }}
        onClick={() => setSelected(title)}
        icon={icon}
      >
        {!isCollapsed && <Typography>{title}</Typography>}
        <Link to={to} />
      </MenuItem>
    </Tooltip>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  //const companyName = localStorage.getItem("username")

  const handleAvatarClick = () => {
    setIsEditProfileOpen(true);
  };

  const renderSectionTitle = (title) => {
    if (!isCollapsed) {
      return (
        <Typography
          variant="h6"
          color={colors.grey[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {title}
        </Typography>
      );
    }
    return (
      <Box
        sx={{
          width: "35px",
          height: "0.1px",
          backgroundColor: colors.grey[300],
          m: "15px 0 5px 20px",
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          position: "fixed",
          width: isCollapsed ? "80px" : "250px",
          height: "100vh",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  Recruiter
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/trinity.png`}
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                    transition: "all 0.3s ease",
                  }}
                  onClick={handleAvatarClick}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = "0.5")}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                />
              </Box>

              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Trinity
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  Software Development
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/recruiter"
              icon={<DashboardOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
            />
            {renderSectionTitle("Job Management")}
            <Item
              title="Post Job"
              to="/recruiter/post-job"
              icon={<PostAddIcon />}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              paddingTop="10px"
            />
            <Item
              title="Manage Jobs"
              to="/recruiter/manage-jobs"
              icon={<WorkOutlineIcon />}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
            />
          </Box>
        </Menu>
      </ProSidebar>
      <Dialog
        open={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <Company onClose={() => setIsEditProfileOpen(false)} />
      </Dialog>
    </Box>
  );
};

export default Sidebar;
