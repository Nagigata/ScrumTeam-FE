import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import JobDetail from "./components/Home/JobDetail";
import NavBar from "./components/Home/NavBar";
import Footer from "./components/Home/Footer";

function App() {
  const [user, setUser] = useState(null);

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
        <Route path="/" element={<Home />} />
        <Route path="/job/:id" element={<JobDetail />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;