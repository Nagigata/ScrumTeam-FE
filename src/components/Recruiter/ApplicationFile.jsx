import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import defaulAvatar from "../../assets/img/default-avatarjpg.jpg";
import Cookies from "js-cookie";

const ApplicationFile = ({ open, onClose, dataDetail }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [showAdvancedProfile, setShowAdvancedProfile] = useState(false);
  const [advancedProfile, setAdvancedProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    onClose();
    setError(null); 
    setShowAdvancedProfile(false); 
    setAdvancedProfile(null); 
  };

  const fetchAdvancedProfile = async (candidateId) => {
    const apiURL =
      process.env.REACT_APP_API_URL +
      `/candidate/candidate_advanced_profile_for_recruiter/?candidate_id=${candidateId}`;
    const accessToken = Cookies.get("access_token");

    try {
      setLoading(true);
      const response = await fetch(apiURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 403) {
        console.error("Access denied. Check your access token.");
        return;
      } else if (response.status === 404) {
        console.error("API endpoint not found.");
        return;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.is_seeking_job) {
          setAdvancedProfile(data);
          setShowAdvancedProfile(true);
        } else {
          setError("Ứng viên không bật chức năng này.");
          setShowAdvancedProfile(false);
        }
      } else {
        console.error("Response is not JSON:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching advanced profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAdvancedProfile = () => {
    if (dataDetail && dataDetail.candidate && dataDetail.candidate.id) {
      fetchAdvancedProfile(dataDetail.candidate.id);
    } else {
      console.error("Candidate ID is missing or invalid");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            bgcolor: colors.primary[400],
            color: colors.grey[100],
            display: "flex",
            alignItems: "center",
          }}
        >
          Application Information
        </DialogTitle>
        <DialogContent>
          {dataDetail && dataDetail.candidate ? (
            <Box display="flex" flexDirection="column" gap="20px" mt="20px">
              <div className="flex">
                <img
                  src={dataDetail.candidate.avatar || defaulAvatar}
                  alt="avatar candidate"
                  loading="lazy"
                  width={300}
                  height={300}
                />
                <div
                  style={{
                    flexDirection: "column",
                    display: "flex",
                    justifyContent: "center",
                    marginLeft: "24px",
                  }}
                >
                  <Typography variant="h6">Name: {dataDetail.candidate.full_name}</Typography>
                  <Typography variant="h6" mt={2}>Phone number: {dataDetail.candidate.phone_number}</Typography>
                  <Typography variant="h6" mt={2}>Email: {dataDetail.candidate.email}</Typography>
                  <Typography variant="h6" mt={2}>Gender: {dataDetail.candidate.is_male ? "Male" : "Female"}</Typography>
                  <Typography variant="h6" mt={2}>
                    CV:{" "}
                    {dataDetail.cv ? (
                      <a href={dataDetail.cv} target="_blank" rel="noopener noreferrer">
                        <FilePresentIcon />
                      </a>
                    ) : (
                      "No CV available"
                    )}
                  </Typography>
                  <Typography variant="h6" mt={2}>
                    Applied at: {new Date(dataDetail.applied_at).toLocaleString()}
                  </Typography>
                </div>
              </div>
            </Box>
          ) : (
            <p>No data available</p>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: colors.primary[400] }}>
          <Button variant="contained" color="primary" onClick={handleViewAdvancedProfile}>
            View Advanced Profile
          </Button>
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
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showAdvancedProfile}
        onClose={() => setShowAdvancedProfile(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: colors.primary[400],
            color: colors.grey[100],
            display: "flex",
            alignItems: "center",
          }}
        >
          Advanced Profile
        </DialogTitle>
        <DialogContent>
          {advancedProfile ? (
            <Box display="flex" flexDirection="column" gap="20px" mt="20px">
              <div className="flex">
                <img
                  src={advancedProfile.avatar || defaulAvatar}
                  alt="avatar advanced profile"
                  loading="lazy"
                  width={300}
                  height={300}
                />
                <div
                  style={{
                    flexDirection: "column",
                    display: "flex",
                    justifyContent: "center",
                    marginLeft: "24px",
                  }}
                >
                  <Typography variant="h6">Summary: {advancedProfile.summary}</Typography>
                  <Typography variant="h6" mt={2}>Skills: {advancedProfile.skills}</Typography>
                  <Typography variant="h6" mt={2}>Work Experience: {advancedProfile.work_experience}</Typography>
                  <Typography variant="h6" mt={2}>Education: {advancedProfile.education}</Typography>
                  <Typography variant="h6" mt={2}>Projects: {advancedProfile.projects}</Typography>
                  <Typography variant="h6" mt={2}>Languages: {advancedProfile.other_information.languages}</Typography>
                  <Typography variant="h6" mt={2}>Certifications: {advancedProfile.other_information.certifications}</Typography>
                  <Typography variant="h6" mt={2}>Years of Experience: {advancedProfile.other_information.years_of_experience}</Typography>
                  <Typography variant="h6" mt={2}>Preferred Work Location: {advancedProfile.other_information.preferred_work_location}</Typography>
                </div>
              </div>
            </Box>
          ) : (
            <Typography>No advanced profile data available</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: colors.primary[400] }}>
          <Button onClick={() => setShowAdvancedProfile(false)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Dialog open={true} onClose={() => setError(null)}>
          <DialogTitle>Thông báo</DialogTitle>
          <DialogContent>
            <Alert severity="warning">{error}</Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setError(null)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ApplicationFile;
