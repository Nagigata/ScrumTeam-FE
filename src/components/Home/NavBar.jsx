import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";

const NavBar = () => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="navBar flex justify-between items-center p-[3rem]">
      <div className="logoDiv">
        <h1 className="logo text-[25px] text-blueColor">
          <strong>Dev</strong>Hunt
        </h1>
      </div>

      <div className="menu flex gap-8">
        <li className="navBarLi ">Jobs</li>
        <li className="navBarLi ">Companies</li>
        <li className="navBarLi ">Contact</li>

        {username ? (
          <>
            <li className="navBarLi ">Welcome, {username} !!</li>
            <li className="navBarLi  hoverRed">
              <button
                onClick={() => {
                  localStorage.removeItem("username");
                  localStorage.removeItem("userRole");
                  setUsername(null);
                  window.location.reload();
                }}
              >
                <LoginOutlinedIcon className="mr-1" /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="navBarLi">
              <Link to="/login">Login</Link>
            </li>
            <li className="navBarLi">
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
