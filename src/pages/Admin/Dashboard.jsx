import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
import { tokens } from "../../theme";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import StatBox from "../../components/Admin/StatBox";
import Header from "../../components/Recruiter/Header";
import LineChart from "../../components/Admin/LineChart";
import PieChart from "../../components/Admin/PieChart";
import Cookies from "js-cookie";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    numberCandidate: 0,
    numberCompany: 0,
    numberJobPosting: 0,
  });

  const fetchDashboardData = async () => {
    const apiURL = process.env.REACT_APP_API_URL;
    const accessToken = Cookies.get("access_token");

    try {
      // Fetch number of candidate
      const candidateRes = await fetch(
        `${apiURL}/candidate/admin_get_number_of_candidate/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Fetch number of company
      const companyRes = await fetch(
        `${apiURL}/company/admin_get_number_of_company/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Fetch number of job postings
      const jobPostingsRes = await fetch(
        `${apiURL}/job/admin_get_number_of_job_posting/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (candidateRes.ok && companyRes.ok && jobPostingsRes.ok) {
        const candidateData = await candidateRes.json();
        const companyData = await companyRes.json();
        const jobPostingsData = await jobPostingsRes.json();

        setDashboardData((prevData) => ({
          ...prevData,
          numberCandidate: candidateData.number_candidate,
          numberCompany: companyData.number_company,
          numberJobPosting: jobPostingsData.number_job_posting,
        }));
      } else {
        console.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress sx={{ color: colors.grey[100] }} />
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardData.numberCandidate.toString()}
            subtitle="Candidates"
            icon={
              <PeopleAltOutlinedIcon
                sx={{ color: colors.grey[300], fontSize: "32px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardData.numberCompany.toString()}
            subtitle="Recruiters"
            icon={
              <BusinessOutlinedIcon
                sx={{ color: colors.grey[300], fontSize: "32px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardData.numberJobPosting.toString()}
            subtitle="Job Postings"
            icon={
              <WorkOutlineOutlinedIcon
                sx={{ color: colors.grey[300], fontSize: "32px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 7"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Number of candidates finding jobs
              </Typography>
            </Box>
          </Box>
          <Box height="250px">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 5"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Statistics on the number of users
              </Typography>
            </Box>
          </Box>
          <Box height="250px">
            <PieChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
