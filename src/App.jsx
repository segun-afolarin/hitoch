import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

// Hi-Touch Global theme
import theme from "./theme";

// Public website pages
import Home from "./pages/Home";
import Countries from "./pages/Countries";
import Canada from "./pages/Canada";
import UnitedKingdom from "./pages/UnitedKingdom";

// Shared student dashboard layout
import StudentLayout from "./components/student/layout/StudentLayout";

// Student pages
import StudentHome from "./pages/student/StudentHome";
import StudentProfile from "./pages/student/StudentProfile";
import StudentApplications from "./pages/student/StudentApplications";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public website */}
        <Route path="/" element={<Home />} />

        <Route path="/countries" element={<Countries />} />

        <Route
          path="/countries/canada"
          element={<Canada />}
        />

        <Route
          path="/countries/united-kingdom"
          element={<UnitedKingdom />}
        />

        {/* Student dashboard: shared theme, sidebar and topbar */}
        <Route
          path="/student"
          element={
            <ThemeProvider theme={theme}>
              <StudentLayout />
            </ThemeProvider>
          }
        >
          {/* /student */}
          <Route
            index
            element={<StudentHome preview />}
          />

          {/* /student/profile */}
          <Route
            path="profile"
            element={<StudentProfile />}
          />

          {/* /student/applications */}
          <Route
            path="applications"
            element={<StudentApplications preview />}
          />

          {/* Add future student routes here. */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}