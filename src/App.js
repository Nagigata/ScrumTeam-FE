import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
<<<<<<< HEAD
import JobDetail from "./components/Home/JobDetail";
import NavBar from "./components/Home/NavBar";
import Footer from "./components/Home/Footer";
=======
import Recruiter from "./AppRecruiter";
import Cookies from "js-cookie";
>>>>>>> 095c767bbcfb6b70a337a382f568e733cc805340

function App() {
  const user = localStorage.getItem("username");
  const userRole = localStorage.getItem("userRole");
  const accessToken = Cookies.get("access_token");
  const refresh_token = Cookies.get("access_token");
  console.log(accessToken);
  console.log(refresh_token);

  console.log(user);
  console.log(userRole);
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <SignIn />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <SignUp />}
        />
<<<<<<< HEAD
        <Route path="/" element={<Home />} />
        <Route path="/job/:id" element={<JobDetail />} />
=======
        <Route
          path="/"
          element={
            userRole === "recruiter" ? <Navigate to="/recruiter" /> : <Home />
          }
        />
        <Route
          path="/recruiter/*"
          element={
            userRole === "recruiter" ? <Recruiter /> : <Navigate to="/" />
          }
        />
>>>>>>> 095c767bbcfb6b70a337a382f568e733cc805340
      </Routes>
      <Footer />
    </div>
  );
}

export default App;