import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Dialog,
  DialogContent,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Recruiter/Header";
import { useTheme } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import JobDetails from "../../components/Admin/JobDetails";
import Cookies from "js-cookie";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const showAlert = useCallback((message, severity) => {
    setAlert({
      open: true,
      message,
      severity,
    });
  }, []);

  const getSelectedJobData = () => {
    return jobsData.find((job) => job.id === selectedJobId);
  };

  const handleCloseJobDetails = () => {
    setSelectedJobId(null);
  };

  const fetchJobs = useCallback(async () => {
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const accessToken = Cookies.get("access_token");

      const response = await fetch(
        `${apiURL}/job/admin_get_list_job_posting/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("🚀 ~ fetchJobs ~ data:", data);

        const transformedData = data.map((job) => ({
          id: job.id,
          companyName: job.company.name,
          title: job.title,
          location: job.location,
          salary: job.salary_range,
          level: job.level,
          experience: job.experience,
          skills: job.skill_required,
          createdAt: new Date(job.created_at).toLocaleDateString(),
          expiresAt: new Date(job.expired_at).toLocaleDateString(),
          status: job.status,
        }));
        setJobsData(data);
        setJobs(transformedData);
      } else {
        console.error("Failed to fetch jobs");
        showAlert("Failed to fetch jobs", "error");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      showAlert("Error fetching jobs", "error");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "companyName",
      headerName: "Company",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "title",
      headerName: "Job Title",
      flex: 1.5,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
    },
    {
      field: "salary",
      headerName: "Salary Range",
      flex: 1,
    },
    {
      field: "level",
      headerName: "Level",
      flex: 0.8,
    },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "expiresAt",
      headerName: "Expires",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "Pending"
              ? "warning"
              : params.value === "Rejected"
              ? "error"
              : "success"
          }
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Tooltip title="View Details">
          <IconButton
            onClick={() => setSelectedJobId(row.id)}
            color="default"
            size="small"
          >
            <VisibilityOutlinedIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

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
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <Header
        title="JOB POSTING MANAGEMENT"
        subtitle="Review and Approve Job Postings"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
          "& .MuiChip-root": {
            fontWeight: "bold",
          },
        }}
      >
        <DataGrid
          rows={jobs}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
        />
      </Box>
      <Dialog
        maxWidth="md"
        fullWidth
        open={Boolean(selectedJobId)}
        onClose={handleCloseJobDetails}
      >
        <DialogContent>
          {selectedJobId && (
            <JobDetails
              jobData={getSelectedJobData()}
              onClose={handleCloseJobDetails}
              onStatusUpdate={(message, severity) => {
                showAlert(message, severity);
                fetchJobs();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ManageJobs;
