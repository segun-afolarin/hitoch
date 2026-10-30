
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

// Theme
import theme from "./theme";

// Public website pages
import Home from "./pages/Home";
import Countries from "./pages/Countries";
import Canada from "./pages/Canada";
import UnitedKingdom from "./pages/UnitedKingdom";

// Student dashboard layout
import StudentLayout from "./components/student/layout/StudentLayout";

// Student dashboard pages
import StudentHome from "./pages/student/StudentHome";
import StudentProfile from "./pages/student/StudentProfile";
import StudentApplications from "./pages/student/StudentApplications";

// Not Found page
function NotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="site-container not-found"
    >
      <p className="eyebrow">HITOUCH GLOBAL</p>

      <h1>Let's get you back on course.</h1>

      <p>
        The page you're looking for isn't available at this address.
      </p>

      <Link className="button button-primary" to="/">
        Back to home
      </Link>
    </main>
  );
}

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

        {/* Student dashboard */}
        <Route
          path="/student"
          element={
            <ThemeProvider theme={theme}>
              <StudentLayout />
            </ThemeProvider>
          }
        >
          {/* Student dashboard home */}
          <Route
            index
            element={<StudentHome preview />}
          />

          {/* Student profile */}
          <Route
            path="profile"
            element={<StudentProfile />}
          />

          {/* Student applications */}
          <Route
            path="applications"
            element={<StudentApplications preview />}
          />
        </Route>

        {/* Unknown routes */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}
