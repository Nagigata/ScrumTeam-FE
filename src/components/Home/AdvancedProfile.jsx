import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import AuthButton from "../Auth/AuthButton";
import InputField from "../Auth/InputField";
import TextAreaField from "../Auth/TextAreaField";
import {
  Code as CodeIcon,
  Close as CloseIcon,
  School as EducationIcon,
  Language as LanguageIcon,
  EmojiObjects as InterestsIcon,
  ContactPage as ReferencesIcon,
  EmojiEvents as ActivitiesIcon,
  WorkspacePremium as CertificationsIcon,
} from "@mui/icons-material";
import Cookies from "js-cookie";
 
const Candidate = () => {
  const [status, setStatus] = useState({ success: "", error: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [skillOption, setSkillOption] = useState([]);
  const [location, setLocation] = useState([]);
  const [experienceOption, setExperienceOption] = useState([]);
  const [salaryOption, setSalaryOption] = useState([]);
 
  useEffect(() => {
    fetchUserProfile();
    fetchSkill();
    fetchDataLocation();
    fetchExperienceOptions();
    fetchSalaryOptions();
  }, []);
 
  const fetchSkill = async () => {
    const apiURL = process.env.REACT_APP_API_URL + "/options/get_all_skills/";
    try {
      const response = await fetch(apiURL, { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch skills");
      }
      const data = await response.json();
      const formattedSkills = data.map((item) => ({
        id: item.id,
        label: item.skill,
      }));
      setSkillOption(formattedSkills);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };  
 
  const fetchDataLocation = async () => {
    const apiURL = "https://provinces.open-api.vn/api/";
    try {
      const res = await fetch(apiURL, {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch locations");
      }
      const data = await res.json();
      const locationNames = data.map((province) => province.name);
      setLocation(locationNames);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };
 
  const fetchExperienceOptions = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/options/get_all_years_of_experience/"
      );
      if (!response.ok) throw new Error("Failed to fetch experience options");
     
      const data = await response.json();
      setExperienceOption(data.map((item) => ({ id: item.id, label: item.yoe })));
    } catch (error) {
      console.error("Error fetching experience options:", error);
    }
  };
 
  const fetchSalaryOptions = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/options/get_all_salary_ranges"
      );
      if (!response.ok) throw new Error("Failed to fetch salary options");
     
      const data = await response.json();
      setSalaryOption(data.map((item) => ({ id: item.id, label: item.salary_range })));
    } catch (error) {
      console.error("Error fetching salary options:", error);
    }
  };
 
  const fetchUserProfile = async () => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;
 
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/candidate/advanced-profile/",
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
  
    const apiURL = process.env.REACT_APP_API_URL + "/candidate/advanced-profile/";
    const accessToken = Cookies.get("access_token");
  
    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: values.summary,
          skills: values.skills.join(", "),
          work_experience: values.work_experience,
          education: values.education,
          projects: values.projects,
          other_information: {
            languages: values.languages,
            interests: values.interests,
            references: values.references,
            activities: values.activities,
            certifications: values.certifications,
            additional_info: values.additional_info,
            preferred_salary: values.preferred_salary,
            preferred_work_location: values.preferred_work_location,
            years_of_experience: values.years_of_experience,
          },
          is_seeking_job: values.is_seeking_job,
        }),
      });
  
      if (response.ok) {
        setStatus({ success: "Profile updated successfully!", error: "" });
        fetchUserProfile();
      } else {
        const errorData = await response.json();
        setStatus({ error: errorData.message || "Error updating profile.", success: "" });
      }
    } catch (error) {
      setStatus({ error: "Network error.", success: "" });
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
          Candidate Advanced Profile
        </h2>
 
        <Formik
          initialValues={{
            summary: userProfile.summary || "",
            skills: Array.isArray(userProfile.skills)
              ? userProfile.skills
              : [userProfile.skills].filter(Boolean),
            work_experience: userProfile.work_experience || "",
            education: userProfile.education || "",
            projects: userProfile.projects || "",
            languages: userProfile.other_information?.languages || "",
            interests: userProfile.other_information?.interests || "",
            references: userProfile.other_information?.references || "",
            activities: userProfile.other_information?.activities || "",
            certifications: userProfile.other_information?.certifications || "",
            additional_info:
              userProfile.other_information?.additional_info || "",
            preferred_salary: userProfile.other_information?.preferred_salary || "",  
            preferred_work_location: userProfile.other_information?.preferred_work_location || "",
            years_of_experience: userProfile.other_information?.years_of_experience || "",
            is_seeking_job: userProfile?.is_seeking_job ?? false,
          }}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form>
              {/* Summary */}
              <TextAreaField
                label="Summary"
                name="summary"
                placeholder="Brief overview of your professional background"
                rows={4}
                errors={errors}
                touched={touched}
              />
 
              {/* Skills */}
              <div className="mb-6">
                <label className="block text-[#19ADC8] text-sm font-semibold mb-2">
                  <div className="flex items-center">Programming Skills</div>
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <CodeIcon className="h-5 w-5 text-[#19ADC8]" />
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
                      {skillOption
                        .filter((skill) => !values.skills.includes(skill.label))
                        .map((skill) => (
                          <option key={skill.id} value={skill.label}>
                            {skill.label}
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
 
              {/* Education */}
              <InputField
                label="Education"
                name="education"
                type="text"
                placeholder="Your educational qualifications"
                icon={EducationIcon}
                errors={errors}
                touched={touched}
              />
 
              {/* Work Experience */}
              <TextAreaField
                label="Work Experience"
                name="work_experience"
                placeholder="Your work history and roles"
                rows={4}
                errors={errors}
                touched={touched}
              />
 
              {/* Projects */}
              <TextAreaField
                label="Projects"
                name="projects"
                placeholder="Implemented projects"
                rows={4}
                errors={errors}
                touched={touched}
              />
 
              {/* Other Information */}
              <div className="mb-6">
                <h3 className="text-[#19ADC8] text-lg font-semibold mb-4">
                  Other Information
                </h3>
 
              <div className="mb-6">
                {/* Years of Experience */}
                <label className="block text-[#19ADC8] text-sm font-semibold mb-2">
                  Years of experience
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <CodeIcon className="h-5 w-5 text-[#19ADC8]" />
                  </span>
                  <select
                    name="years_of_experience"
                    onChange={(e) => setFieldValue("years_of_experience", e.target.value)}
                    value={values.years_of_experience}
                    className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select years of experience</option>
                    {experienceOption.map((option) => (
                      <option key={option.id} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
 
              <div className="mb-6">
                {/* Preferred Salary */}
                <label className="block text-[#19ADC8] text-sm font-semibold mb-2">
                  Preferred salary
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <CodeIcon className="h-5 w-5 text-[#19ADC8]" />
                  </span>
                  <select
                    name="preferred_salary"
                    onChange={(e) => setFieldValue("preferred_salary", e.target.value)}
                    value={values.preferred_salary}
                    className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select salary</option>
                    {salaryOption.map((option) => (
                      <option key={option.id} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
 
              <div className="mb-6">
                {/* Preferred Work Location */}
                <label className="block text-[#19ADC8] text-sm font-semibold mb-2">
                  Preferred work location
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <CodeIcon className="h-5 w-5 text-[#19ADC8]" />
                  </span>
                  <select
                    name="preferred_work_location"
                    onChange={(e) => setFieldValue("preferred_work_location", e.target.value)}
                    value={values.preferred_work_location}
                    className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select area</option>
                    {location.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
                {/* Languages */}
                <InputField
                  label="Languages"
                  name="languages"
                  type="text"
                  placeholder="Languages you know"
                  icon={LanguageIcon}
                  errors={errors}
                  touched={touched}
                />
 
                {/* Interests */}
                <InputField
                  label="Interests"
                  name="interests"
                  type="text"
                  placeholder="Your hobbies and interests"
                  icon={InterestsIcon}
                  errors={errors}
                  touched={touched}
                />
 
                {/* References */}
                <InputField
                  label="References"
                  name="references"
                  type="text"
                  placeholder="Professional references"
                  icon={ReferencesIcon}
                  errors={errors}
                  touched={touched}
                />
 
                {/* Activities */}
                <InputField
                  label="Activities"
                  name="activities"
                  type="text"
                  placeholder="Extracurricular activities"
                  icon={ActivitiesIcon}
                  errors={errors}
                  touched={touched}
                />
 
                {/* Certifications */}
                <InputField
                  label="Certifications"
                  name="certifications"
                  type="text"
                  placeholder="Professional certifications"
                  icon={CertificationsIcon}
                  errors={errors}
                  touched={touched}
                />
 
                {/* Additional Info */}
                <TextAreaField
                  label="Additional Information"
                  name="additional_info"
                  placeholder="Other relevant details"
                  rows={4}
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div className="mb-6">
                <label className="block text-[#19ADC8] text-sm font-semibold mb-2">
                  Share Advance Profile
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_seeking_job"
                    checked={values.is_seeking_job}
                    onChange={(e) => setFieldValue("is_seeking_job", e.target.checked)}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm">Share profile with recruiters</span>
                </div>
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