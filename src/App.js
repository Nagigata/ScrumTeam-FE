import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import Candidate from "./pages/ProfileManage/Candidate";

function App() {
  const [user, setUser] = useState(null);

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
        <Route path="/" element={<Home />} />
        {/* <Route
          path="/candidate"
          element={user ? <Candidate /> : <Navigate to="/login" />}
        /> */}
        <Route path="/candidate" element={<Candidate />} />
      </Routes>
    </div>
  );
}

export default App;
