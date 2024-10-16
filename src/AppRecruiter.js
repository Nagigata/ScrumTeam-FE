import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useMode, ColorModeContext } from "./theme";
import Topbar from "./pages/Recruiter/Topbar";
import Sidebar from "./pages/Recruiter/Sidebar";
import PostJob from "./pages/Recruiter/PostJob";
import ManageJobs from "./pages/Recruiter/ManageJobs";
// import Dashboard from "./pages/Admin/Dashboard";

function Recruiter() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              {/* <Route path="/" element={<Dashboard />} /> */}
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/manage-jobs" element={<ManageJobs />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default Recruiter;
