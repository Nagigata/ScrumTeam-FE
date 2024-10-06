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
        <li className="menuList text-[#6f6f6f] hover:text-blueColor">Jobs</li>
        <li className="menuList text-[#6f6f6f] hover:text-blueColor">
          Companies
        </li>
        <li className="menuList text-[#6f6f6f] hover:text-blueColor">
          Contact
        </li>

        {username ? (
          <>
            <li className="menuList text-[#6f6f6f] hover:text-blueColor">
              Welcome, {username} !!
            </li>
            <li className="menuList text-[#6f6f6f] hover:text-red-600">
              <button
                onClick={() => {
                  localStorage.removeItem("username");
                  setUsername(null);
                }}
              >
                <LoginOutlinedIcon className="mr-1" /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="menuList text-[#6f6f6f] hover:text-blueColor">
              <Link to="/login">Login</Link>
            </li>
            <li className="menuList text-[#6f6f6f] hover:text-blueColor">
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
