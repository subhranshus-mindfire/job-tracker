import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import MyJobs from "./pages/MyJobs";
import NoAuthorization from "./pages/NoAuthorization";
import ProtectedRoute from "./services/ProtectedRoutes";
import NoUser from "./pages/NoUser";
import ApplicantsPage from "./pages/ApplicantsPage";
import MyApplications from "./pages/MyApplications";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/my-jobs" element={<ProtectedRoute role="employer"> <MyJobs /></ProtectedRoute>} />
          <Route path="/unauthorized" element={<NoAuthorization />} />
          <Route path="/unauthenticated" element={<NoUser />} />
          <Route path="/job/:id/applicants" element={<ProtectedRoute role="employer"> <ApplicantsPage /></ProtectedRoute>} />
          <Route path="/my-applications" element={<ProtectedRoute role="applicant"><MyApplications /></ProtectedRoute>}
          />
        </Route>
      </Routes>
    </Router>
  );
}

