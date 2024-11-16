import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./pages/Admin/Topbar";
import Sidebar from "./pages/Admin/Sidebar";
import Dashboard from "./pages/Admin/Dashboard";
import ManageCandidate from "./pages/Admin/ManageCandidate";
import ManageCompany from "./pages/Admin/ManageCompany";
import ManageJobs from "./pages/Admin/ManageJobs";
import ManageSalary from "./pages/Admin/ManageSalary";
import ManageYoE from "./pages/Admin/ManageYoE";
import ManageLevel from "./pages/Admin/ManageLevel";
import ManageSkill from "./pages/Admin/ManageSkill";
import ManageJobType from "./pages/Admin/ManageJobType";
import ManageContract from "./pages/Admin/ManageContract";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

function Admin() {
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
              <Route path="/" element={<Dashboard />} />
              <Route path="/manage-candidates" element={<ManageCandidate />} />
              <Route path="/manage-companys" element={<ManageCompany />} />
              <Route path="/manage-jobs" element={<ManageJobs />} />
              <Route path="/manage-salarys" element={<ManageSalary />} />
              <Route path="/manage-yoes" element={<ManageYoE />} />
              <Route path="/manage-levels" element={<ManageLevel />} />
              <Route path="/manage-skills" element={<ManageSkill />} />
              <Route path="/manage-job-types" element={<ManageJobType />} />
              <Route path="/manage-contracts" element={<ManageContract />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default Admin;
