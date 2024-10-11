import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import JobDetail from "./components/Home/JobDetail";
import Candidate from "./pages/ProfileManage/Candidate";
import NavBar from "./components/Home/NavBar";
import Footer from "./components/Home/Footer";
import Recruiter from "./AppRecruiter";
import Cookies from "js-cookie";

function App() {
  const user = localStorage.getItem("username");
  const userRole = localStorage.getItem("userRole");
  const accessToken = Cookies.get("access_token");
  const refresh_token = Cookies.get("access_token");
  console.log(accessToken);
  console.log(refresh_token);

  console.log(user);
  console.log(userRole);

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
                <Route
                  path="/login"
                  element={user ? <Navigate to="/" /> : <SignIn />}
                />
                <Route
                  path="/register"
                  element={user ? <Navigate to="/" /> : <SignUp />}
                />
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
                  path="/candidate"
                  element={
                    userRole === "recruiter" ? (
                      <Navigate to="/" />
                    ) : (
                      <Candidate />
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
