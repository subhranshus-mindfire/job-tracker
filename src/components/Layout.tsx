import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Outlet, Link, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import JobModal from "./JobModal";
import RegisterModal from "./RegisterModal";
import Alert from "./Alert";

export default function Layout() {
  const { user, logout } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const logOut = () => {
    navigate("/");
    setTimeout(() => {
      logout();
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Alert />
      <nav className="bg-white text-blue-700 px-4 py-5 md:px-6 md:py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex w-full md:w-auto justify-between items-center">
          <Link to="/" className="text-3xl font-bold md:me-6">
            JobPortal
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-3xl md:hidden"
          >
            &#9776;
          </button>
        </div>

        <div
          className={`w-full md:flex md:items-center md:justify-between md:space-x-6 ${mobileMenuOpen ? "block" : "hidden"
            }`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:gap-5 mt-4 md:mt-0 text-base md:text-xl font-medium text-gray-600">
            <Link to="/" className="py-2 md:py-0 text-center">
              Home
            </Link>

            {user?.role === "employer" && (
              <Link to="/my-jobs" className="py-2 md:py-0 text-center">
                My Jobs
              </Link>
            )}

            {user?.role === "applicant" && (
              <Link to="/my-applications" className="py-2 md:py-0 text-center">
                My Applications
              </Link>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4 md:mt-0 text-base md:text-xl">
            {user ? (
              <>
                <span className=" md:text-xl text-center">Hi, {user.name}</span>
                <button
                  onClick={logOut}
                  className="border-2 bg-blue-700 text-white px-3 py-2 rounded-full hover:border-blue-800 "
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:border-blue-700"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="border bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 px-4 md:px-6 bg-gray-100">
        <Outlet
          context={{ setShowLoginModal, setShowRegisterModal, setShowJobModal }}
        />
      </main>

      <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600">
        &copy; 2025 JobPortal. All rights reserved.
      </footer>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          setShowRegisterModal={setShowRegisterModal}
        />
      )}

      {showJobModal && user?.role === "employer" && (
        <JobModal
          employerId={user.role_id}
          onClose={() => setShowJobModal(false)}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          setShowLoginModal={setShowLoginModal}
        />
      )}
    </div>
  );
}
