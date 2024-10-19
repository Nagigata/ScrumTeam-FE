import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import defaulAvatar from "../../assets/img/default-avatarjpg.jpg";
const levels = ["Entry", "Junior", "Middle", "Senior", "Lead"];

const ApplicationFile = ({ open, onClose, dataDetail }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleClose = () => {
    onClose();
  };

  return (
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
                src={
                  dataDetail.candidate.avatar === null
                    ? defaulAvatar
                    : dataDetail.candidate.avatar
                }
                alt={"avatar candidate"}
                loading="lazy"
                width={300}
                height={300}
              />
              <div
                className="ml-24"
                style={{
                  flexDirection: "column",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <span className="text-xl">
                  Name: {dataDetail.candidate.full_name}
                </span>
                <span className="text-xl mt-3">
                  Phone number: {dataDetail.candidate.phone_number}
                </span>
                <span className="text-xl mt-3">
                  Email: {dataDetail.candidate.email}
                </span>
                <span className="text-xl mt-3">
                  Gender: {dataDetail.candidate.is_male ? "male" : "female"}
                </span>
                <span className="text-xl mt-3">
                  CV:
                  {dataDetail.cv ? (
                    <a
                      href={dataDetail.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FilePresentIcon
                        className="ml-2"
                        style={{ transform: "translateY(-2px)" }}
                      />
                    </a>
                  ) : (
                    "No CV available"
                  )}
                </span>
                <span className="text-xl mt-3">
                  Applied at: {new Date(dataDetail.applied_at).toLocaleString()}
                </span>
              </div>
            </div>
          </Box>
        ) : (
          <p>No data available</p>
        )}
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
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationFile;
