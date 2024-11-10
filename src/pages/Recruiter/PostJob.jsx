import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Paper,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Recruiter/Header";
import Cookies from "js-cookie";
import { tokens } from "../../theme";
import { title } from "framer-motion/client";

const initialValues = {
  job_type: "",
  title: "",
  description: "",
  skill_required: "",
  benefits: "",
  location: "",
  role: "",
  salary_range: "",
  minimum_year_of_exp: "",
  // status: "Draft",
  level: "",
  experience: "",
  interview_process: "",
  expired_at: "",
  contract_type: '',
  specific_address: ''
};

const jobSchema = yup.object().shape({
  job_type: yup.string().required("Required"),
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
  skill_required: yup.string().required("Required"),
  benefits: yup.string().required("Required"),
  location: yup.string().required("Required"),
  contract_type: yup.string().required("Required"),
  salary_range: yup.string().required("Required"),
  role: yup.string().required("Required"),
  specific_address: yup.string().required("Required"),
  level: yup.string().required("Required"),
  minimum_year_of_exp: yup.string().required("Required"),
  interview_process: yup.string().required("Required"),
  expired_at: yup
    .date()
    .min(new Date(), "Expiration date must be in the future")
    .required("Required"),
});

// const levels = ["Entry", "Junior", "Middle", "Senior", "Lead"];
// const statusOptions = ["Active", "Inactive", "Draft"];


//Data Test -------------------------------------------------------------------------------
// const contract_type = ['Full Time', 'Part Time'];
// const jobCategories = ['In Office', 'Hybird', 'Remote', 'Oversea'];
// const minimum_year_of_exp = ['Dưới 1 năm', '1-2 năm', '3 năm', 'Trên 5 năm'];
// const salary_range = ['1 - 5 triệu', '5 - 10 triệu', '10 - 20 triệu', 'Trên 20 triệu'];
//Data Test -------------------------------------------------------------------------------

const PostJob = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [location, setLocation] = useState([]);
  const [salaryRange, setSalaryRange] = useState([]);
  const [yearExp, setYearExp] = useState([]);
  const [level, setLevel] = useState([]);
  const [skill, setSkill] = useState([]);
  const [jobType, setJobType] = useState([]);
  const [contractType, setContractType] = useState([]);
  const [isHide, setIsHide] = useState(false);
  const storedIds = Cookies.get("id_job");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const idToCheck = 0;//vài bữa ai làm edit thì nhớ sửa  
  //ở đây bằng tham số id lấy được từ edit, chức năng edit cuart hiện tại 
  //bị lỗi nên t k thử được, nói chung cứ set giá trị  của idToCheck bằng với 
  //id của  thẻ mn click vào, hàm ở dưới sẽ tự thực hiện kiểm tra và set ẩn hiện của button POST
  //---------------------ĐA TẠ---------------------

  // useEffect(() => {
  //   // Nếu cookie không tồn tại, trả về false
  //   if (!storedIds) {
  //     return false; // Không có ID nào trong cookie
  //   }
  
  //   // Chuyển đổi dữ liệu từ cookie thành mảng
  //   const idsArray = JSON.parse(storedIds);
  
  //   // Kiểm tra xem ID có tồn tại trong mảng không
  //   setIsHide(idsArray.includes(idToCheck));
  // }, [idToCheck]);

  useEffect(() => {
    const fetchDataLocation = async () => {
      const apiURL = process.env.REACT_APP_API_URL + '/options/get_all_salary_ranges/';
      try {
        const res = await fetch(apiURL, {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch job categories");
        }
        const data = await res.json();
        setSalaryRange(data);
      } catch (error) {
        console.error("Error fetching job categories:", error);
      }
    };
    fetchDataLocation();
  }, [setLocation]);

  useEffect(() => {
    const fetchDataLocation = async () => {
      const apiURL = process.env.REACT_APP_API_URL + '/options/get_all_contract_types/';
      try {
        const res = await fetch(apiURL, {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch job categories");
        }
        const data = await res.json();
        setContractType(data);
      } catch (error) {
        console.error("Error fetching job categories:", error);
      }
    };
    fetchDataLocation();
  }, [setLocation]);

  useEffect(() => {
    const fetchDataLocation = async () => {
      const apiURL = process.env.REACT_APP_API_URL + '/options/get_all_job_types/';
      try {
        const res = await fetch(apiURL, {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch job categories");
        }
        const data = await res.json();
        setJobType(data);
      } catch (error) {
        console.error("Error fetching job categories:", error);
      }
    };
    fetchDataLocation();
  }, [setLocation]);

  useEffect(() => {
    const fetchDataLocation = async () => {
      const apiURL = process.env.REACT_APP_API_URL + '/options/get_all_skills/';
      try {
        const res = await fetch(apiURL, {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch job categories");
        }
        const data = await res.json();
        setSkill(data);
      } catch (error) {
        console.error("Error fetching job categories:", error);
      }
    };
    fetchDataLocation();
  }, [setLocation]);

  useEffect(() => {
    const fetchDataLocation = async () => {
      const apiURL = process.env.REACT_APP_API_URL + '/options/get_all_levels/';
      try {
        const res = await fetch(apiURL, {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch job categories");
        }
        const data = await res.json();
        setLevel(data);
      } catch (error) {
        console.error("Error fetching job categories:", error);
      }
    };
    fetchDataLocation();
  }, [setLocation]);

  useEffect(() => {
    const fetchDataLocation = async () => {
      const apiURL = process.env.REACT_APP_API_URL + '/options/get_all_years_of_experience/';
      try {
        const res = await fetch(apiURL, {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch job categories");
        }
        const data = await res.json();
        setYearExp(data);
      } catch (error) {
        console.error("Error fetching job categories:", error);
      }
    };
    fetchDataLocation();
  }, [setLocation]);

  useEffect(() => {
    const fetchDataLocation = async () => {
      const apiURL = 'https://provinces.open-api.vn/api/';
      try {
        const res = await fetch(apiURL, {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch job categories");
        }
        const data = await res.json();
        setLocation(data);
      } catch (error) {
        console.error("Error fetching job categories:", error);
      }
    };
    fetchDataLocation();
  }, [setLocation]);

  const handleFormSubmit = async (values, { setSubmitting, setStatus }) => {
    const apiURL = process.env.REACT_APP_API_URL + "/job/add_and_post_job/";
    const accessToken = Cookies.get("access_token");
    const confirmValues = {
      job_type: values.job_type,
      title: values.title,
      description: values.description,
      skill_required: selectedSkills.join(', '),
      benefits: values.benefits,
      location: values.location,
      salary_range: values.salary_range,
      level: values.level,
      minimum_years_of_experience: values.minimum_year_of_exp,
      role_and_responsibilities: values.role,
      interview_process: values.interview_process,
      expired_at: values.expired_at,
      contract_type: values.contract_type,
      specific_address: values.specific_address
    };

    console.log(">>> test: ", confirmValues);
    try {
      const res = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(confirmValues),
      });

      const data = await res.json();

      if (res.status === 201) {
        setStatus({ success: "Job posted successfully!" });
        setIsHide(true);
        // if (!storedIds) {
        //   const idsArray = [res.data.results.id];
        //   Cookies.set("id_job", JSON.stringify(idsArray), { expires: 7 });
        // } else {
        //   const idsArray = JSON.parse(storedIds);
        //   idsArray.push(res.data.results.id);
        //   Cookies.set("id_job", JSON.stringify(idsArray), { expires: 7 });
        // }
      }
    } catch (error) {
      console.error("Network or parsing error:", error);
      setStatus({
        error:
          "Network error or invalid response format. Please check your connection and try again.",
      });
    }

    setSubmitting(false);
  };

  const handleClickSave = async (values, { setSubmitting, setStatus }) => {
    const apiURL = process.env.REACT_APP_API_URL + "/job/add_job/";
    const accessToken = Cookies.get("access_token");
    const confirmValues = {
      job_type: values.job_type,
      title: values.title,
      description: values.description,
      skill_required: selectedSkills.join(', '),
      benefits: values.benefits,
      location: values.location,
      salary_range: values.salary_range,
      level: values.level,
      minimum_years_of_experience: values.minimum_year_of_exp,
      role_and_responsibilities: values.role,
      interview_process: values.interview_process,
      expired_at: values.expired_at,
      contract_type: values.contract_type,
      specific_address: values.specific_address
    };

    console.log(">>> test: ", confirmValues);
    try {
      const res = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(confirmValues),
      });

      const data = await res.json();

      if (res.status === 201) {
        setStatus({ success: "Job saved successfully!" });
      }
    } catch (error) {
      console.error("Network or parsing error:", error);
      setStatus({
        error:
          "Network error or invalid response format. Please check your connection and try again.",
      });
    }
    setSubmitting(false);
  }

  const handleSkillChange = (event, setFieldValue) => {
    const skill = event.target.value;
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setFieldValue('skill_required', skill);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  return (
    <Box m="20px">
      <Header title="POST JOB" subtitle="Create a New Job Posting" />
      <Paper
        elevation={3}
        sx={{ p: 4, mt: 4, backgroundColor: colors.primary[400] }}
      >
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={jobSchema}
        >
          {({ errors, touched, values, status, setFieldValue, setSubmitting, setStatus }) => (
            <Form>
              <Box display="flex" flexDirection="column" gap={3}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Job Details
                </Typography>
                <Divider
                  sx={{
                    borderBottomWidth: 3,
                    borderColor: colors.grey[100],
                  }}
                />
                <Box
                  display="flex"
                  flexDirection={isNonMobile ? "row" : "column"}
                  gap={3}
                >
                  <Field
                    as={TextField}
                    fullWidth
                    select
                    variant="filled"
                    label="Job Type"
                    name="job_type"
                    error={touched.job_type && errors.job_type}
                    helperText={touched.job_type && errors.job_type}
                  >
                    {jobType.map((_job, index) => (
                      <MenuItem key={index} value={_job.job_type}>
                        {_job.job_type}
                      </MenuItem>
                    ))}
                  </Field>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    label="Job Title"
                    name="title"
                    error={touched.title && errors.title}
                    helperText={touched.title && errors.title}
                  />
                </Box>
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  error={touched.description && errors.description}
                  helperText={touched.description && errors.description}
                />
                <Box
                  display="flex"
                  flexDirection={isNonMobile ? "row" : "column"}
                  gap={3}
                >
                  <Field
                    as={TextField}
                    select
                    fullWidth
                    variant="filled"
                    label="Skills Required"
                    name="skill_required"
                    error={touched.skill_required && errors.skill_required}
                    helperText={touched.skill_required && errors.skill_required}
                    onChange={(event) => handleSkillChange(event, setFieldValue)}
                  >
                    {skill.map((_skill, index) => (
                      <MenuItem key={index} value={_skill.skill}>
                        {_skill.skill}
                      </MenuItem>
                    ))}
                  </Field>

                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    label="Benefits"
                    name="benefits"
                    multiline
                    error={touched.benefits && errors.benefits}
                    helperText={touched.benefits && errors.benefits}
                  />
                </Box>
                {selectedSkills.length > 0 && (
                  <div className="flex">
                    {selectedSkills.map((skill, index) => (
                      <span key={index} className="mr-2 bg-gray-200 px-2 py-1 rounded cursor-pointer" onClick={() => handleRemoveSkill(skill)}>
                        {skill} <button className="ml-2 text-gray-500 hover:text-gray-700">x</button>
                      </span>
                    ))}
                  </div>
                )}
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Job Requirements
                </Typography>
                <Divider
                  sx={{
                    borderBottomWidth: 3,
                    borderColor: colors.grey[100],
                  }}
                />

                <Box
                  display="flex"
                  flexDirection={isNonMobile ? "row" : "column"}
                  gap={3}
                >
                  <Field
                    as={TextField}
                    select
                    fullWidth
                    variant="filled"
                    label="Level"
                    name="level"
                    error={touched.level && errors.level}
                    helperText={touched.level && errors.level}
                  >
                    {level.map((_level, index) => (
                      <MenuItem key={index} value={_level.level}>
                        {_level.level}
                      </MenuItem>
                    ))}
                  </Field>
                  <Field
                    as={TextField}
                    fullWidth
                    select
                    variant="filled"
                    label="Minimum Year Of Experience"
                    name="minimum_year_of_exp"
                    error={touched.minimum_year_of_exp && errors.minimum_year_of_exp}
                    helperText={touched.minimum_year_of_exp && errors.minimum_year_of_exp}
                  >
                    {yearExp.map((exp, index) => (
                      <MenuItem key={index} value={exp.yoe}>
                        {exp.yoe}
                      </MenuItem>
                    ))}
                  </Field>
                </Box>

                <Box
                  display="flex"
                  flexDirection={isNonMobile ? "row" : "column"}
                  gap={3}
                >
                <Field
                    as={TextField}
                    fullWidth
                    select
                    variant="filled"
                    label="Location"
                    name="location"
                    error={touched.location && errors.location}
                    helperText={touched.location && errors.location}
                  >
                    {location.map((location, index) => (
                      <MenuItem key={index} value={location.name}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </Field>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    label="Specific Address"
                    name="specific_address"
                    error={touched.specific_address && errors.specific_address}
                    helperText={touched.specific_address && errors.specific_address}
                  />
                </Box>

                {/* ---------------------------------------------------------------------------------- */}
                <Box
                  display="flex"
                  flexDirection={isNonMobile ? "row" : "column"}
                  gap={3}
                >
                <Field
                    as={TextField}
                    fullWidth
                    select
                    variant="filled"
                    label="Contract Type"
                    name="contract_type"
                    error={touched.contract_type && errors.contract_type}
                    helperText={touched.contract_type && errors.contract_type}
                  >
                    {contractType.map((contract, index) => (
                      <MenuItem key={index} value={contract.contract_type}>
                        {contract.contract_type}
                      </MenuItem>
                    ))}
                  </Field>
                  <Field
                    as={TextField}
                    fullWidth
                    select
                    variant="filled"
                    label="Salary Range"
                    name="salary_range"
                    error={touched.salary_range && errors.salary_range}
                    helperText={touched.salary_range && errors.salary_range}
                  >
                    {salaryRange.map((salary, index) => (
                      <MenuItem key={index} value={salary.salary_range}>
                        {salary.salary_range}
                      </MenuItem>
                    ))}
                </Field>
                </Box>

                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  label="Role & Responsibilities"
                  name="role"
                  error={touched.role && errors.role}
                  helperText={touched.role && errors.role}
                />
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  label="Interview Process"
                  name="interview_process"
                  multiline
                  rows={3}
                  error={touched.interview_process && errors.interview_process}
                  helperText={
                    touched.interview_process && errors.interview_process
                  }
                />
                <Field
                  as={TextField}
                  fullWidth
                  variant="filled"
                  type="datetime-local"
                  label="Expiration Date"
                  name="expired_at"
                  InputLabelProps={{ shrink: true }}
                  error={touched.expired_at && errors.expired_at}
                  helperText={touched.expired_at && errors.expired_at}
                />
              </Box>
              {status && status.error && (
                <Box color="error.main" mt={2} textAlign="center">
                  {status.error}
                </Box>
              )}
              {status && status.success && (
                <Box color="success.main" mt={2} textAlign="center">
                  {status.success}
                </Box>
              )}
              <Box display="flex" mt="20px">
                <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', gap: '20px'}}>
                  <Button
                    onClick={() => handleClickSave(values, { setSubmitting, setStatus })}
                    style={{backgroundColor: '#58c481', cursor: 'pointer'}}
                    variant="contained"
                    sx={{
                      width: "200px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Save
                  </Button>
                  {!isHide && (
                    <Button
                      style={{ backgroundColor: '#70c2d6' }}
                      type="submit"
                      color="primary"
                      variant="contained"
                      sx={{
                        width: "200px",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Post Job
                    </Button>
                  )}
                </div>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default PostJob;
