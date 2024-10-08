import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import Recruiter from "./AppRecruiter";

function App() {
  const user = localStorage.getItem("username");
  const userRole = localStorage.getItem("userRole");

  return (
    <div className="App">
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
      </Routes>
    </div>
  );
}

export default App;
