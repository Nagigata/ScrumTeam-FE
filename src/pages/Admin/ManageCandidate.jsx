import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Recruiter/Header";
import { useTheme } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BlockIcon from "@mui/icons-material/Block";
import Cookies from "js-cookie";

const ManageCandidates = () => {
  const [candidates, setCandidates] = useState([]);
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

  const fetchCandidates = useCallback(async () => {
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const accessToken = Cookies.get("access_token");
      const response = await fetch(
        `${apiURL}/candidate/admin_get_list_candidate/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const transformedData = data.map((candidate) => ({
          id: candidate.id,
          fullName: candidate.full_name,
          gender: candidate.is_male ? "Male" : "Female",
          birthDate: candidate.birthday,
          phone: candidate.phone_number,
          email: candidate.email,
          address: candidate.address || "N/A",
          status: candidate.is_active ? "active" : "inactive",
        }));
        setCandidates(transformedData);
      } else {
        console.error("Failed to fetch candidates");
        showAlert("Failed to fetch candidates", "error");
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      showAlert("Error fetching candidates", "error");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleActivateCandidate = async (email) => {
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const accessToken = Cookies.get("access_token");

      const formData = new URLSearchParams();
      formData.append("email", email);

      const response = await fetch(
        `${apiURL}/candidate/admin_activate_candidate/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        }
      );

      if (response.ok) {
        showAlert("Candidate activated successfully", "success");
        await fetchCandidates();
      } else {
        showAlert("Failed to activate candidate", "error");
      }
    } catch (error) {
      console.error("Error activating candidate:", error);
      showAlert("Error activating candidate", "error");
    }
  };

  const handleBlockCandidate = async (email) => {
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const accessToken = Cookies.get("access_token");

      const formData = new URLSearchParams();
      formData.append("email", email);

      const response = await fetch(
        `${apiURL}/candidate/admin_block_candidate/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        }
      );

      if (response.ok) {
        showAlert("Candidate blocked successfully", "success");
        await fetchCandidates();
      } else {
        showAlert("Failed to block candidate", "error");
      }
    } catch (error) {
      console.error("Error blocking candidate:", error);
      showAlert("Error blocking candidate", "error");
    }
  };

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

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "birthDate",
      headerName: "Date of Birth",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        return date.toLocaleDateString("en-US");
      },
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value === "active" ? "Active" : "Inactive"}
          color={params.value === "active" ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.7,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          gap="8px"
          alignItems="center"
          justifyContent="center"
          marginTop={1.5}
        >
          {params.row.status !== "active" && (
            <IconButton
              onClick={() => handleActivateCandidate(params.row.email)}
              color="success"
              size="small"
              title="Activate Candidate"
            >
              <CheckCircleOutlineIcon fontSize="medium" />
            </IconButton>
          )}
          {params.row.status === "active" && (
            <IconButton
              onClick={() => handleBlockCandidate(params.row.email)}
              color="error"
              size="small"
              title="Block Candidate"
            >
              <BlockIcon fontSize="medium" />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

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
        title="CANDIDATE MANAGEMENT"
        subtitle="Managing the Candidate List"
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
          rows={candidates}
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
    </Box>
  );
};

export default ManageCandidates;
