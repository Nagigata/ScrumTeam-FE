import { useState, useEffect } from "react";
import { ProSidebarProvider, Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Dialog } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import Cookies from "js-cookie";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={() => setSelected(title)}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const SidebarComponent = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);

  // useEffect(() => {
  //   const accessToken = Cookies.get("access_token");
  //   if (accessToken) {
  //     fetchCompanyProfile(accessToken);
  //   }
  // }, []);

  // const fetchCompanyProfile = async (accessToken) => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_API_URL}/company/profile/`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       setCompanyProfile(data);
  //     } else {
  //       console.error("Failed to fetch company profile");
  //       if (response.status === 401) {
  //         Cookies.remove("userRole");
  //         Cookies.remove("access_token");
  //         Cookies.remove("refresh_token");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching company profile:", error);
  //   }
  // };

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
    <ProSidebarProvider>
      <Box
        sx={{
          height: "100vh",
          "& .ps-sidebar-root": {
            border: "none !important",
            height: "100vh",
          },
          "& .ps-menu-button:hover": {
            backgroundColor: "transparent !important",
            color: "#868dfb !important",
          },
          "& .ps-menu-button.ps-active": {
            color: "#6870fa !important",
          },
        }}
      >
        <Sidebar collapsed={isCollapsed} backgroundColor={colors.primary[400]}>
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
                    Admin
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {!isCollapsed && (
              <Box mb="25px">
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    "& img": {
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: `2px solid ${colors.grey[100]}`,
                      padding: "3px",
                      backgroundColor: colors.primary[400],
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        opacity: 0.8,
                        transform: "scale(1.05)",
                        boxShadow: `0 0 10px ${colors.primary[500]}`,
                      },
                    },
                  }}
                >
                  <img
                    alt={companyProfile?.name || "Company Logo"}
                    src={companyProfile?.avatar || `../../assets/logo.png`}
                    onClick={handleAvatarClick}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    {companyProfile?.name || "Admin"}
                  </Typography>
                  <Typography variant="h5" color={colors.greenAccent[500]}>
                    {companyProfile?.description || "Admin"}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Dashboard"
                to="/admin"
                icon={<DashboardOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              {renderSectionTitle("Management")}
              <Item
                title="Manage Candidates"
                to="/admin/manage-candidates"
                icon={<PeopleAltOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Manage Companys"
                to="/admin/manage-companys"
                icon={<BusinessOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Manage Jobs"
                to="/admin/manage-jobs"
                icon={<WorkOutlineIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              {renderSectionTitle("Job Settings")}
              <Item
                title="Salary Ranges"
                to="/admin/manage-salarys"
                icon={<PaymentsOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Years of Experience"
                to="/admin/manage-yoes"
                icon={<WorkHistoryOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Experience Levels"
                to="/admin/manage-levels"
                icon={<StarBorderOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Programming Skills"
                to="/admin/manage-skills"
                icon={<CodeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Job Types"
                to="/admin/manage-job-types"
                icon={<BusinessCenterOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Contract Types"
                to="/admin/manage-contracts"
                icon={<AssignmentIndOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              {/* <Item
                title="Locations"
                to="/admin/manage-locations"
                icon={<LocationOnOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              /> */}
            </Box>
          </Menu>
        </Sidebar>
        {/* <Dialog
          open={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <Company onClose={() => setIsEditProfileOpen(false)} />
        </Dialog> */}
      </Box>
    </ProSidebarProvider>
  );
};

export default SidebarComponent;
