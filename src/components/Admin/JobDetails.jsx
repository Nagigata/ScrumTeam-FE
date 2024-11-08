import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import Cookies from "js-cookie";

const JobDetails = ({ jobData, onClose, onStatusUpdate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rejectionReason, setRejectionReason] = useState("");
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!jobData) {
    return (
      <Box p={2}>
        <Typography variant="h6" color="error">
          Job details not found
        </Typography>
      </Box>
    );
  }

  const DetailSection = ({ label, value }) => (
    <Typography variant="body2" gutterBottom>
      <strong>{label}:</strong> {value || "N/A"}
    </Typography>
  );

  const handleAccept = async () => {
    try {
      setIsSubmitting(true);
      const apiURL = process.env.REACT_APP_API_URL;
      const accessToken = Cookies.get("access_token");

      const response = await fetch(`${apiURL}/job/admin_accept_job_posting/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `job_id=${jobData.id}`,
      });

      if (response.ok) {
        onStatusUpdate("Job approved successfully", "success");
        setOpenApproveDialog(false);
        onClose();
      } else {
        onStatusUpdate("Failed to approve job", "error");
      }
    } catch (error) {
      onStatusUpdate("Error approving job", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      onStatusUpdate("Please provide a rejection reason", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const apiURL = process.env.REACT_APP_API_URL;
      const accessToken = Cookies.get("access_token");

      const response = await fetch(`${apiURL}/job/admin_reject_job_posting/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `job_id=${jobData.id}&rejection_reason=${encodeURIComponent(
          rejectionReason
        )}`,
      });

      if (response.ok) {
        onStatusUpdate("Job rejected successfully", "success");
        setOpenRejectDialog(false);
        onClose();
      } else {
        onStatusUpdate("Failed to reject job", "error");
      }
    } catch (error) {
      onStatusUpdate("Error rejecting job", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card elevation={0} sx={{ backgroundColor: colors.primary[400] }}>
        <CardHeader
          title={jobData.title}
          subheader={
            <Chip
              label={jobData.status}
              color={
                jobData.status === "Pending"
                  ? "warning"
                  : jobData.status === "Rejected"
                  ? "error"
                  : "success"
              }
              size="small"
              sx={{ mt: 1 }}
            />
          }
          action={
            jobData.status === "Pending" && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setOpenApproveDialog(true)}
                  disabled={isSubmitting}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setOpenRejectDialog(true)}
                  disabled={isSubmitting}
                >
                  Reject
                </Button>
              </Box>
            )
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Job Information
              </Typography>
              <DetailSection
                label="Job Type"
                value={jobData.job_type?.job_type}
              />
              <DetailSection label="Location" value={jobData.location} />
              <DetailSection
                label="Salary Range"
                value={jobData.salary_range}
              />
              <DetailSection label="Level" value={jobData.level} />
              <DetailSection
                label="Experience Required"
                value={`${jobData.minimum_years_of_experience} years`}
              />
              <DetailSection
                label="Required Skills"
                value={jobData.skill_required}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Company Information
              </Typography>
              <DetailSection
                label="Company Name"
                value={jobData.company.name}
              />
              <DetailSection label="Website" value={jobData.company.website} />
              <DetailSection label="Contact" value={jobData.company.hotline} />
              <DetailSection
                label="About Company"
                value={jobData.company.description}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Additional Details
              </Typography>
              <DetailSection
                label="Job Description"
                value={jobData.description}
              />
              <DetailSection
                label="Interview Process"
                value={jobData.interview_process}
              />
              <DetailSection label="Benefits" value={jobData.benefits} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Approve Confirmation Dialog */}
      <Dialog
        open={openApproveDialog}
        onClose={() => setOpenApproveDialog(false)}
      >
        <DialogTitle>Confirm Job Approval</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this job posting from{" "}
            {jobData.company.name}? Once approved, it will be visible to all
            candidates in the job search.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenApproveDialog(false)}
            color="inherit"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAccept}
            color="success"
            variant="contained"
            disabled={isSubmitting}
          >
            Confirm Approval
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
      >
        <DialogTitle>Reject Job Posting</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for rejecting this job posting.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenRejectDialog(false)}
            color="inherit"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            color="error"
            variant="contained"
            disabled={isSubmitting}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JobDetails;
