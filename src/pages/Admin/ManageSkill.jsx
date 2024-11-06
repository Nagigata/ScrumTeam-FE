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

const ManageSkill = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [formData, setFormData] = useState({
    skill: "",
    codename: "",
  });
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

  const fetchSkills = useCallback(async () => {
    try {
      const accessToken = Cookies.get("access_token");
      const response = await fetch(`${apiURL}/options/skills/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      } else {
        showAlert("Failed to fetch skills", "error");
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      showAlert("Error fetching skills", "error");
    } finally {
      setLoading(false);
    }
  }, [apiURL, showAlert]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleOpenDialog = (mode, skill = null) => {
    setDialogMode(mode);
    setSelectedSkill(skill);
    setFormData({
      skill: skill ? skill.skill : "",
      codename: skill ? skill.codename : "",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSkill(null);
    setFormData({ skill: "", codename: "" });
  };

  const generateCodename = (skillName) => {
    return skillName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSkillChange = (e) => {
    const newSkill = e.target.value;
    setFormData({
      ...formData,
      skill: newSkill,
      codename: generateCodename(newSkill),
    });
  };

  const handleSubmit = async () => {
    try {
      const accessToken = Cookies.get("access_token");
      const url =
        dialogMode === "add"
          ? `${apiURL}/options/skills/`
          : `${apiURL}/options/skills/${selectedSkill.id}/`;

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
          `Skill ${dialogMode === "add" ? "added" : "updated"} successfully`,
          "success"
        );
        handleCloseDialog();
        fetchSkills();
      } else {
        showAlert("Operation failed", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showAlert("Operation failed", "error");
    }
  };

  const handleDeleteSkill = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        const accessToken = Cookies.get("access_token");
        const response = await fetch(`${apiURL}/options/skills/${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          showAlert("Skill deleted successfully", "success");
          fetchSkills();
        } else {
          showAlert("Failed to delete skill", "error");
        }
      } catch (error) {
        console.error("Error deleting skill:", error);
        showAlert("Error deleting skill", "error");
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
    {
      field: "skill",
      headerName: "Skill Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "codename",
      headerName: "Code Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
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
            title="Edit Skill"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteSkill(params.row.id)}
            color="error"
            size="small"
            title="Delete Skill"
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
        <Header
          title="SKILLS MANAGEMENT"
          subtitle="Managing Programming Skills"
        />
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
          rows={skills}
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
          {dialogMode === "add" ? "Add New Skill" : "Edit Skill"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Skill Name"
            type="text"
            fullWidth
            value={formData.skill}
            onChange={handleSkillChange}
          />
          <TextField
            margin="dense"
            label="Code Name"
            type="text"
            fullWidth
            value={formData.codename}
            onChange={(e) =>
              setFormData({
                ...formData,
                codename: e.target.value.toLowerCase(),
              })
            }
            helperText="Automatically generated from skill name, but can be modified"
          />
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

export default ManageSkill;
