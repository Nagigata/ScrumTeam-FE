import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignInForm from "./pages/Auth/SignIn";
import SignUpForm from "./pages/Auth/SignUp";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <SignInForm />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <SignUpForm />}
        />
        <Route
          path="/"
          element={user ? <div>Home Page</div> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
