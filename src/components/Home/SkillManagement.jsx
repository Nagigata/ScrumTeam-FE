import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import AuthButton from "../../components/Auth/AuthButton";
import {
  Code as CodeIcon,
  WorkOutline as LevelIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import CVManagement from "./CVManagement";
import Cookies from "js-cookie";

const Candidate = () => {
  const [status, setStatus] = useState({ success: "", error: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const programmingLanguages = [
    "Java",
    "Python",
    "JavaScript",
    "C++",
    "C#",
    "PHP",
    "Ruby",
    "Swift",
    "Go",
    "Kotlin",
  ];

  const experienceLevels = [
    "Intern",
    "Fresher",
    "Junior",
    "Mid-level",
    "Senior",
    "Lead",
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/candidate/profile/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserProfile({
          ...data,
          skills:
            typeof data.skills === "string"
              ? data.skills.split(", ").map((skill) => skill.trim())
              : data.skills,
        });
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setStatus({ success: "", error: "" });
    setIsSubmitting(true);
    const apiURL = process.env.REACT_APP_API_URL + "/candidate/profile/";
    const accessToken = Cookies.get("access_token");

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: userProfile.full_name,
          is_male: userProfile.is_male,
          phone_number: userProfile.phone_number,
          skills: values.skills.join(", "), // Convert array to comma-separated string
          level: values.level,
        }),
      });

      if (response.ok) {
        setStatus({ success: "Profile updated successfully!", error: "" });
        fetchUserProfile();
      } else if (response.status === 401) {
        setStatus({ error: "Unauthorized. Please log in again.", success: "" });
      } else {
        const errorData = await response.json();
        setStatus({
          error:
            errorData.message ||
            "An error occurred while updating the profile.",
          success: "",
        });
      }
    } catch (error) {
      setStatus({
        error: "Network error. Please check your connection.",
        success: "",
      });
    }

    setIsSubmitting(false);
    setSubmitting(false);
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  const SkillTag = ({ skill, onRemove }) => (
    <span className="inline-flex items-center px-2 py-1 mr-2 mb-2 bg-blue-100 text-blue-800 rounded">
      {skill}
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 text-blue-600 hover:text-blue-800"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </span>
  );

  return (
    <div>
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          Candidate Portfolio
        </h2>

        <Formik
          initialValues={{
            skills: Array.isArray(userProfile.skills)
              ? userProfile.skills
              : [userProfile.skills].filter(Boolean),
            level: userProfile.level || "",
          }}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form>
              {/* Skills Dropdown */}
              <div className="mb-6">
                <label className="block text-[#19ADC8] text-sm font-semibold mb-2">
                  <div className="flex items-center">Programming Skills</div>
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <CodeIcon className="h-5 w-5 text-[#010101]" />
                    </span>
                    <select
                      value=""
                      onChange={(e) => {
                        if (
                          e.target.value &&
                          !values.skills.includes(e.target.value)
                        ) {
                          setFieldValue("skills", [
                            ...values.skills,
                            e.target.value,
                          ]);
                        }
                      }}
                      className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">
                        Select additional programming languages
                      </option>
                      {programmingLanguages
                        .filter((lang) => !values.skills.includes(lang))
                        .map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="min-h-[40px] p-2 border rounded-md ">
                    {values.skills.map(
                      (skill, index) =>
                        skill && (
                          <SkillTag
                            key={index}
                            skill={skill}
                            sx={{}}
                            onRemove={() => {
                              const newSkills = values.skills.filter(
                                (_, i) => i !== index
                              );
                              setFieldValue("skills", newSkills);
                            }}
                          />
                        )
                    )}
                  </div>
                </div>
              </div>

              {/* Experience Level Dropdown */}
              <div className="mb-6">
                <label className="block text-[#19ADC8] text-sm font-semibold mb-2">
                  Experience Level
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <LevelIcon className="h-5 w-5 text-[#010101]" />
                  </span>
                  <select
                    name="level"
                    value={values.level}
                    onChange={(e) => setFieldValue("level", e.target.value)}
                    className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select experience level</option>
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <CVManagement />
              </div>

              {/* Submit Button */}
              <AuthButton
                label="Save Information"
                isLoading={isSubmitting}
                isSubmitting={isSubmitting}
              />
            </Form>
          )}
        </Formik>

        {status.success && (
          <div className="mt-4 text-center text-green-600">
            {status.success}
          </div>
        )}
        {status.error && (
          <div className="mt-4 text-center text-red-600">{status.error}</div>
        )}
      </div>
    </div>
  );
};

export default Candidate;
