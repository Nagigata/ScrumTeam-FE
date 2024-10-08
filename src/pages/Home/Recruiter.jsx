import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useMode, ColorModeContext } from "../../theme";
import Topbar from "../Recruiter/Topbar";
import Sidebar from "../Recruiter/Sidebar";
import PostJob from "../Recruiter/PostJob";
import ManageJobs from "../Recruiter/ManageJobs";
import { motion } from "framer-motion";

function Recruiter() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <motion.main
            className="content"
            initial={{ opacity: 0, x: isSidebar ? 0 : -200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{ duration: 0.3 }}
          >
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/manage-jobs" element={<ManageJobs />} />
            </Routes>
          </motion.main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default Recruiter;
