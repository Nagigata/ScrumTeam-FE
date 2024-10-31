import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import JobDetail from "./components/Home/JobDetail";
import AdvancedProfile from "./components/Home/AdvancedProfile";
import Candidate from "./pages/ProfileManage/Candidate";
import CVManagement from "./components/Home/CVManagement";
import ApplicationStatus from "./components/Home/ApplicationStatus";
import NavBar from "./components/Home/NavBar";
import Footer from "./components/Home/Footer";
import Recruiter from "./AppRecruiter";
import Cookies from "js-cookie";

function App() {
  const userRole = Cookies.get("userRole");
  const accessToken = Cookies.get("access_token");
  const refresh_token = Cookies.get("access_token");

  console.log(accessToken);
  console.log(refresh_token);
  console.log(userRole);

  // Nếu chọn sai role thì chạy dòng này:
  // Cookies.remove("userRole");
  // Cookies.remove("access_token");
  // Cookies.remove("access_token");
  const MainLayout = ({ children }) => (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );

  return (
    <div className="App">
      <Routes>
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/login" element={<SignIn />} />
                <Route path="/register" element={<SignUp />} />
                <Route
                  path="/job/:id"
                  element={
                    userRole === "recruiter" ? (
                      <Navigate to="/" />
                    ) : (
                      <JobDetail />
                    )
                  }
                />
                <Route
                  path="/basic-profile"
                  element={
                    userRole === "recruiter" ? (
                      <Navigate to="/" />
                    ) : (
                      <Candidate />
                    )
                  }
                />
                <Route
                  path="/advanced-profile"
                  element={
                    userRole === "recruiter" ? (
                      <Navigate to="/" />
                    ) : (
                      <AdvancedProfile />
                    )
                  }
                />
                <Route
                  path="/cv-management"
                  element={
                    userRole === "recruiter" ? (
                      <Navigate to="/" />
                    ) : (
                      <CVManagement />
                    )
                  }
                />
                <Route
                  path="/application-status"
                  element={
                    userRole === "recruiter" ? (
                      <Navigate to="/" />
                    ) : (
                      <ApplicationStatus />
                    )
                  }
                />

                <Route
                  path="/"
                  element={
                    userRole === "recruiter" ? (
                      <Navigate to="/recruiter" />
                    ) : (
                      <Home />
                    )
                  }
                />
              </Routes>
            </MainLayout>
          }
        />
        <Route
          path="/recruiter/*"
          element={
            userRole === "recruiter" ? <Recruiter /> : <Navigate to="/" />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
