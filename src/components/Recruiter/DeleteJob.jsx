import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

const DeleteJob = ({ open, onClose, onDelete, job }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleDelete = () => {
    if (reason.trim() === "") {
      setError("Please provide a reason for deletion.");
      return;
    }
    if (job && job.id) {
      onDelete(job.id, reason);
    }
    setReason("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  if (!job) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: colors.primary[400],
          color: colors.grey[100],
          display: "flex",
          alignItems: "center",
        }}
      >
        <DeleteIcon sx={{ mr: 1 }} />
        Delete Job
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Are you sure you want to delete the job "{job.title}"? This action
          cannot be undone.
        </Alert>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Job Type: {job.type}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Level: {job.level}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Location: {job.location}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Application Period: {job.applicationStartDate} to{" "}
          {job.applicationEndDate}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Description: {job.description}
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="reason"
          label="Reason for deletion"
          type="text"
          fullWidth
          variant="outlined"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          error={!!error}
          helperText={error}
          required
          autoComplete="off"
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: colors.primary[400] }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            color: colors.grey[100],
            borderColor: colors.grey[400],
            "&:hover": {
              borderColor: colors.grey[600],
              bgcolor: colors.grey[700],
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          startIcon={<DeleteIcon />}
          color="error"
        >
          Delete Job
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteJob;
