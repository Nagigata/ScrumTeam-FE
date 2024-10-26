import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CVManagement = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [hasCv, setHasCv] = useState(false);
  const [cvUrl, setCvUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const accessToken = Cookies.get("access_token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/candidate/profile/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setHasCv(!!data.cv);
        setCvUrl(data.cv || "");
      } else if (response.status === 401) {
        Cookies.remove("userRole");
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setSelectedFile(file);
      setMessage("");
      setStatus("idle");
    } else {
      setMessage("Please upload a PDF or Word document");
      setStatus("error");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMessage("");
      setStatus("idle");
    }
  };

  const uploadCV = async () => {
    if (!selectedFile) {
      setMessage("Please select a CV file to upload");
      setStatus("error");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("cv", selectedFile);

    try {
      const accessToken = Cookies.get("access_token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/candidate/manage_cv/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setMessage("CV uploaded successfully");
        setStatus("success");
        setHasCv(true);
        setSelectedFile(null);
        fetchUserProfile();
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
      } else {
        setMessage("Error occurred while uploading CV");
        setStatus("error");
      }
    } catch (error) {
      setMessage("Error connecting to server");
      setStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteCV = async () => {
    setIsDeleting(true);
    try {
      const accessToken = Cookies.get("access_token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/candidate/manage_cv/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setMessage("CV deleted successfully");
        setStatus("success");
        setHasCv(false);
        setCvUrl("");
      } else {
        setMessage(
          response.status === 404
            ? "No CV found to delete"
            : "Error occurred while deleting CV"
        );
        setStatus("error");
      }
    } catch (error) {
      setMessage("Error connecting to server");
      setStatus("error");
    } finally {
      setIsDeleting(false);
    }
  };

  const viewCV = () => {
    if (cvUrl) {
      window.open(cvUrl, "_blank");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto my-10 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">CV Management</h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload your CV in PDF or Word format
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Message */}
        {message && (
          <div
            className={`flex items-center gap-2 p-4 rounded-lg border ${
              status === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {status === "success" ? (
              <CheckCircleIcon className="w-5 h-5" />
            ) : (
              <ErrorIcon className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {/* Current CV Display */}
        {hasCv && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DescriptionIcon className="w-5 h-5 text-blueColor" />
                <span className="text-sm font-medium text-[#535ac8]">
                  Current CV uploaded
                </span>
              </div>
              <button
                onClick={viewCV}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blueColor hover:text-[#535ac8] bg-blue-100 rounded-md transition-colors"
              >
                <VisibilityIcon className="w-4 h-4" />
                View CV
              </button>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors
            ${
              dragActive
                ? "border-blueColor bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />

          <div className="text-center space-y-4">
            <CloudUploadIcon
              className={`w-12 h-12 mx-auto ${
                selectedFile ? "text-blueColor" : "text-gray-400"
              }`}
            />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                {selectedFile
                  ? selectedFile.name
                  : "Drag and drop your CV here"}
              </p>
              <p className="text-xs text-gray-500">
                Supports PDF, DOC, DOCX up to 10MB 
                <br></br>
                (just kidding, only 1MB lol!)
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-5 justify-center">
          <button
            onClick={uploadCV}
            disabled={!selectedFile || isUploading}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors
              ${
                !selectedFile || isUploading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blueColor hover:bg-[#535ac8]"
              }`}
          >
            <UploadFileIcon className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Upload CV"}
          </button>

          {hasCv && (
            <button
              onClick={deleteCV}
              disabled={isDeleting}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  isDeleting
                    ? "bg-red-300 text-white cursor-not-allowed"
                    : "bg-red-100 text-red-600 hover:bg-red-200"
                }
                `}
            >
              <DeleteIcon className="w-4 h-4" />
              {isDeleting ? "Deleting..." : "Delete CV"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVManagement;
