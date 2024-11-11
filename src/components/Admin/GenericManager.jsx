import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Recruiter/Header";
import { useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Cookies from "js-cookie";

const GenericManager = ({
  title,
  subtitle,
  endpoint,
  itemName,
  formFields = ["name", "codename"],
  generateCodename,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const apiURL = process.env.REACT_APP_API_URL;

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

  const fetchItems = useCallback(async () => {
    try {
      const accessToken = Cookies.get("access_token");
      const response = await fetch(`${apiURL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        showAlert(`Failed to fetch ${itemName}s`, "error");
      }
    } catch (error) {
      console.error(`Error fetching ${itemName}s:`, error);
      showAlert(`Error fetching ${itemName}s`, "error");
    } finally {
      setLoading(false);
    }
  }, [apiURL, endpoint, itemName, showAlert]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleOpenDialog = (mode, item = null) => {
    setDialogMode(mode);
    setSelectedItem(item);
    if (item) {
      setFormData(item);
    } else {
      const initialFormData = {};
      formFields.forEach((field) => {
        initialFormData[field] = "";
      });
      setFormData(initialFormData);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    const initialFormData = {};
    formFields.forEach((field) => {
      initialFormData[field] = "";
    });
    setFormData(initialFormData);
  };

  const handlePrimaryFieldChange = (e, fieldName) => {
    const newValue = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: newValue,
      codename: generateCodename(newValue),
    }));
  };

  const handleFormChange = (e, fieldName) => {
    const newValue = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: newValue,
    }));
  };

  const handleSubmit = async () => {
    try {
      const accessToken = Cookies.get("access_token");
      const url =
        dialogMode === "add"
          ? `${apiURL}${endpoint}`
          : `${apiURL}${endpoint}${selectedItem.id}/`;

      const method = dialogMode === "add" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData),
      });

      if (response.ok) {
        showAlert(
          `${itemName} ${
            dialogMode === "add" ? "added" : "updated"
          } successfully`,
          "success"
        );
        handleCloseDialog();
        fetchItems();
      } else {
        showAlert("Operation failed", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showAlert("Operation failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this ${itemName}?`)) {
      try {
        const accessToken = Cookies.get("access_token");
        const response = await fetch(`${apiURL}${endpoint}${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          showAlert(`${itemName} deleted successfully`, "success");
          fetchItems();
        } else {
          showAlert(`Failed to delete ${itemName}`, "error");
        }
      } catch (error) {
        console.error(`Error deleting ${itemName}:`, error);
        showAlert(`Error deleting ${itemName}`, "error");
      }
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    ...formFields.map((field) => ({
      field,
      headerName: field.charAt(0).toUpperCase() + field.slice(1),
      flex: 1,
      align: "center",
      headerAlign: "center",
    })),
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          gap="20px"
          alignItems="center"
          justifyContent="center"
          marginTop={1.5}
        >
          <IconButton
            onClick={() => handleOpenDialog("edit", params.row)}
            color="default"
            size="small"
            title={`Edit ${itemName}`}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            color="error"
            size="small"
            title={`Delete ${itemName}`}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
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

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Header title={title} subtitle={subtitle} />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog("add")}
          sx={{
            backgroundColor: colors.blueAccent[600],
            padding: "10px 20px",
            borderRadius: "10px",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: colors.blueAccent[700],
            },
          }}
        >
          Add New
        </Button>
      </Box>

      <Box
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
        }}
      >
        <DataGrid
          rows={items}
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogMode === "add" ? `Add New ${itemName}` : `Edit ${itemName}`}
        </DialogTitle>
        <DialogContent>
          {formFields.map((field, index) => (
            <TextField
              key={field}
              autoFocus={index === 0}
              margin="dense"
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              type="text"
              fullWidth
              value={formData[field] || ""}
              onChange={(e) =>
                field === formFields[0]
                  ? handlePrimaryFieldChange(e, field)
                  : handleFormChange(e, field)
              }
              helperText={
                field === "codename"
                  ? "Automatically generated, but can be modified"
                  : ""
              }
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {dialogMode === "add" ? "Add" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GenericManager;