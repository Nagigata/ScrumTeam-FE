import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Paper,
  Typography,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormLabel,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "./Header";
import Cookies from "js-cookie";
import { tokens } from "../../theme";
import EditIcon from "@mui/icons-material/Edit";
import { CheckBox } from "@mui/icons-material";

const jobSchema = yup.object().shape({
  date_interview: yup
    .date()
    .min(new Date(), "Interview date must be in the future")
    .required("Required")
    .transform((value, originalValue) => {
      if (originalValue) {
        return new Date(originalValue);
      }
      return value;
    }),
  time_interview: yup
    .string()
    .required("Required")
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:mm format")
    .test("is-future-time", "Interview time must be in the future", function (value) {
      if (!value || !this.parent.date_interview) return false;

      const [hours, minutes] = value.split(":").map(Number);
      const selectedTime = new Date(this.parent.date_interview);
      selectedTime.setHours(hours, minutes, 0, 0);

      const currentTime = new Date();

      return selectedTime > currentTime;
    }),
  address: yup.string().required("Required"),
  note: yup.string().required("Required"),
});

const ApplicationApproved = ({ open, onClose, idCandidate, onInterviewScheduled, jobID  }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (open) {
      setFormKey(prev => prev + 1);
    }
  }, [open]);

  if (!open) return null;

  const handleFormSubmit = async (values, { setSubmitting, setStatus }) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    const formattedValues = {
      candidate_id: idCandidate,
      job_id: jobID,
      interview_type: values.interview_type,
      date_interview: formatDate(values.date_interview),
      time_interview: values.time_interview,
      address: values.address,
      note: values.note,
      duration: 120,
    };

    console.log("Formatted values:", formattedValues);

    const apiURL = "http://cnpm.duytech.site/api/job/add_interview_information/";
    const accessToken = Cookies.get("access_token");

    try {
      setStatus(null);
      const res = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formattedValues),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        setStatus({ success: "Interview scheduled successfully!" });
        setTimeout(() => {
          onClose(true); // true indicates Save was successful
        }, 1500);
      } else {
        let errorMessage;
        if (typeof data.detail === "object") {
          errorMessage = Object.entries(data.detail)
            .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
            .join("\n");
        } else {
          errorMessage = data.detail || data.message || "Failed to schedule interview";
        }
        setStatus({ error: errorMessage });
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
      setStatus({
        error: "Network error. Please check your connection and try again.",
      });
    }

    setSubmitting(false);
  };

  const handleClose = () => {
    onClose(false); // false indicates Cancel was clicked
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: colors.primary[400], color: colors.grey[100] }}>
        <Box display="flex" alignItems="center">
          <EditIcon sx={{ mr: 1 }} />
          Schedule Interview
        </Box>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: colors.primary[400], pt: 5 }}>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={{
            date_interview: "",
            time_interview: "",
            address: "",
            note: "",
            interview_type: ''
          }}
          validationSchema={jobSchema}
        >
          {({
            errors,
            touched,
            values,
            handleChange,
            handleSubmit,
            status,
            isSubmitting,
          }) => (
            <Form id="interview-form" onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap="20px" marginTop={2}>
                {/* Date of Interview */}
                <Field
                  as={TextField}
                  label="Date of Interview"
                  name="date_interview"
                  type="date"
                  value={values.date_interview}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={touched.date_interview && Boolean(errors.date_interview)}
                  helperText={touched.date_interview && errors.date_interview}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ bgcolor: colors.primary[400] }}
                />

                {/* Time of Interview */}
                <Field
                  as={TextField}
                  label="Time of Interview"
                  name="time_interview"
                  type="time"
                  value={values.time_interview}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={touched.time_interview && Boolean(errors.time_interview)}
                  helperText={touched.time_interview && errors.time_interview}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 minutes
                  }}
                  sx={{ bgcolor: colors.primary[400] }}
                />

                {/* Address */}
                <Field
                  as={TextField}
                  label="Address"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                  sx={{ bgcolor: colors.primary[400] }}
                />

                <FormControl
                  component="fieldset"
                  error={touched.interview_type && Boolean(errors.interview_type)}
                >
                  <FormLabel component="legend">Interview Type</FormLabel>
                  <RadioGroup
                    name="interview_type"
                    value={values.interview_type}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="Online"
                      control={<Radio />}
                      label="Online"
                    />
                    <FormControlLabel
                      value="Offline"
                      control={<Radio />}
                      label="Offline"
                    />
                  </RadioGroup>
                  {touched.interview_type && errors.interview_type && (
                    <FormHelperText>{errors.interview_type}</FormHelperText>
                  )}
                </FormControl>

                {/* Note */}
                <Field
                  as={TextField}
                  label="Note"
                  name="note"
                  value={values.note}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  required
                  error={touched.note && Boolean(errors.note)}
                  helperText={touched.note && errors.note}
                  sx={{ bgcolor: colors.primary[400] }}
                />

                {/* Status Messages */}
                {status && status.error && (
                  <Box sx={{ color: "error.main", mt: 2 }}>
                    <Typography variant="body2">{status.error}</Typography>
                  </Box>
                )}
                {status && status.success && (
                  <Box sx={{ color: "success.main", mt: 2 }}>
                    <Typography variant="body2">{status.success}</Typography>
                  </Box>
                )}

                <DialogActions>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Scheduling..." : "Schedule Interview"}
                  </Button>
                  <Button 
                    onClick={handleClose} 
                    variant="outlined" 
                    color="secondary"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationApproved;