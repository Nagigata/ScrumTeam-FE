import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Cookies from "js-cookie";

const validationSchema = Yup.object({
  cv: Yup.mixed()
    .required("CV file is required")
    .test("fileFormat", "Unsupported file format", (value) => {
      if (!value) return false;
      const supportedFormats = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      return supportedFormats.includes(value.type);
    })
    .test("fileSize", "File size must be less than 1MB", (value) => {
      if (!value) return false;
      return value.size <= 5 * 1024 * 1024;
    }),
  is_urgent: Yup.boolean().default(false),
});

const CVUploadForm = ({ onClose, jobId }) => {
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });
  const [filePreview, setFilePreview] = useState({
    url: null,
    type: null,
    name: "",
  });

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (filePreview.url) {
        URL.revokeObjectURL(filePreview.url);
      }
    };
  }, [filePreview.url]);

  const handleFileSelect = (file, setFieldValue) => {
    if (file) {
      // Revoke previous preview URL if exists
      if (filePreview.url) {
        URL.revokeObjectURL(filePreview.url);
      }

      setFieldValue("cv", file);

      // Create preview for PDF files
      if (file.type === "application/pdf") {
        setFilePreview({
          url: URL.createObjectURL(file),
          type: "pdf",
          name: file.name,
        });
      } else {
        // For DOC/DOCX files, just store the name
        setFilePreview({
          url: null,
          type: "doc",
          name: file.name,
        });
      }
    }
  };

  const handleRemoveFile = (setFieldValue) => {
    if (filePreview.url) {
      URL.revokeObjectURL(filePreview.url);
    }
    setFieldValue("cv", null);
    setFilePreview({ url: null, type: null, name: "" });
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setStatus({ loading: true, error: null, success: false });
    const accessToken = Cookies.get("access_token");

    try {
      const formData = new FormData();
      formData.append("job_id", jobId);
      formData.append("cv", values.cv);
      formData.append("is_urgent", values.is_urgent);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/job/apply/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );
      console.log(response.status);
      if (response.status === 201) {
        setStatus({ loading: false, error: null, success: true });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const errorData = await response.json();
        setStatus({
          loading: false,
          error:
            errorData.message ||
            "An error occurred while submitting your application",
          success: false,
        });
      }
    } catch (error) {
      setStatus({
        loading: false,
        error: "File is too large. Maximum file size is 1MB.",
        success: false,
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-[#19ADC8]"
      >
        <CloseIcon />
      </button>

      <h2 className="text-2xl font-bold text-[#19ADC8] mb-4">Upload Your CV</h2>

      <Formik
        initialValues={{
          cv: null,
          is_urgent: false,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Select CV to apply
              </h3>

              {!filePreview.name ? (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center bg-gray-50">
                  <CloudUploadIcon
                    className="mx-auto text-[#19ADC8] mb-2"
                    fontSize="large"
                  />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload CV from your computer, select or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports .doc, .docx, pdf files under 1MB
                  </p>
                  <input
                    type="file"
                    id="cv"
                    name="cv"
                    accept=".doc,.docx,.pdf"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      handleFileSelect(file, setFieldValue);
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="cv"
                    className="mt-3 px-4 py-2 bg-[#19ADC8] text-white rounded hover:bg-opacity-90 transition cursor-pointer inline-block"
                  >
                    Select CV
                  </label>
                </div>
              ) : (
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <InsertDriveFileIcon className="text-[#19ADC8]" />
                      <span className="text-sm font-medium">
                        {filePreview.name}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {filePreview.type === "pdf" && (
                        <button
                          type="button"
                          onClick={() => window.open(filePreview.url, "_blank")}
                          className="p-1 rounded-full hover:bg-gray-100"
                          title="Preview PDF"
                        >
                          <VisibilityIcon className="text-gray-600 hover:text-[#19ADC8]" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(setFieldValue)}
                        className="p-1 rounded-full hover:bg-gray-100"
                        title="Remove file"
                      >
                        <DeleteOutlineIcon className="text-gray-600 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {errors.cv && touched.cv && (
                <div className="text-red-500 text-sm mt-2">{errors.cv}</div>
              )}
            </div>

            {status.error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {status.error}
              </div>
            )}

            {status.success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                Application submitted successfully!
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#19ADC8]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || status.loading || status.success}
                className="px-4 py-2 border-2 border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#19ADC8] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#19ADC8] disabled:opacity-50"
              >
                {status.loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CVUploadForm;
