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

const ManageCompany = () => {
  const [companies, setCompanies] = useState([]);
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

  const fetchCompanies = useCallback(async () => {
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const accessToken = Cookies.get("access_token");
      const response = await fetch(
        `${apiURL}/company/admin_get_list_company/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCompanies(data);
      } else {
        console.error("Failed to fetch companies");
        showAlert("Failed to fetch companies", "error");
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      showAlert("Error fetching companies", "error");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleBlockCompany = async (email) => {
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const accessToken = Cookies.get("access_token");

      const formData = new URLSearchParams();
      formData.append("email", email);

      const response = await fetch(`${apiURL}/company/admin_block_company/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (response.ok) {
        showAlert("Company blocked successfully", "success");
        await fetchCompanies();
      } else {
        showAlert("Failed to block company", "error");
      }
    } catch (error) {
      console.error("Error blocking company:", error);
      showAlert("Error blocking company", "error");
    }
  };

  const handleActivateCompany = async (email) => {
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const accessToken = Cookies.get("access_token");

      const formData = new URLSearchParams();
      formData.append("email", email);

      const response = await fetch(
        `${apiURL}/company/admin_activate_company/`,
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
        showAlert("Company activated successfully", "success");
        await fetchCompanies();
      } else {
        showAlert("Failed to activate company", "error");
      }
    } catch (error) {
      console.error("Error activating company:", error);
      showAlert("Error activating company", "error");
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
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "hotline",
      headerName: "Hotline",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "website",
      headerName: "Website",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "founded_year",
      headerName: "Founded Year",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        return date.getFullYear();
      },
    },
    {
      field: "is_active",
      headerName: "Status",
      flex: 0.7,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "error"}
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
          {!params.row.is_active && (
            <IconButton
              onClick={() => handleActivateCompany(params.row.email)}
              color="success"
              size="small"
              title="Activate Company"
            >
              <CheckCircleOutlineIcon fontSize="medium" />
            </IconButton>
          )}
          {params.row.is_active && (
            <IconButton
              onClick={() => handleBlockCompany(params.row.email)}
              color="error"
              size="small"
              title="Block Company"
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

      <Header title="COMPANY MANAGEMENT" subtitle="Managing the Company List" />
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
          rows={companies}
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

export default ManageCompany;
