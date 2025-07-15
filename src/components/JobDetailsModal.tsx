import React, { useEffect, useState } from "react";
import type { Job } from "../pages/Home";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
  onApply: () => void;
  canApply: boolean;
  setShowLoginModal: (val: boolean) => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  onClose,
  onApply,
  canApply,
  setShowLoginModal,
}) => {
  const { user } = useAuth();

  const [hasApplied, setHasApplied] = useState(false);

  const companyName = job.employer.user.name.replace(/\s+/g, "").toLowerCase();
  const logoUrl = `https://img.logo.dev/${companyName}.com?token=pk_U5pZvgj7Ty2ZWkob2YkBig`;

  useEffect(() => {
    const checkHasApplied = async () => {
      if (user?.role === "applicant") {
        try {
          const res = await api.get(`/applicants/${user.role_id}/has-applied/${job._id}`);

          if (res.data.success) {
            setHasApplied(res.data.data);
          }
        } catch (err) {
          console.error("Error checking application status:", err);
        }
      }
    };

    checkHasApplied();
  }, [user, job._id]);

  return (
    <div className="fixed inset-0 bg-[rgb(0,0,0,0.4)] bg-opacity-50 flex justify-center items-center z-10 px-3 md:px-0">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
        >
          &times;
        </button>

        <img
          src={logoUrl}
          alt={job.employer.user.name}
          className="w-12 h-12 object-contain mb-4"
        />

        <h2 className="text-2xl font-bold mb-2">{job.job_role}</h2>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          {job.employer.user.name}
        </h3>

        <p className="text-gray-600 mb-2">
          <i className="fa-solid fa-location-dot"></i>{" "}
          {job.location ? job.location : "Remote"}
        </p>

        <p className="text-sm text-gray-500 mb-4">
          Posted: {new Date(job.createdAt).toLocaleDateString()}
        </p>

        <p className="mb-6 whitespace-pre-line">{job.description}</p>

        {user && user.role !== "employer" ? (
          canApply ? (
            <button
              onClick={onApply}
              disabled={hasApplied}
              className={`w-full py-2 rounded text-white ${hasApplied
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {hasApplied ? "Already Applied" : "Apply Now"}
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                setShowLoginModal(true);
              }}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Login To Proceed
            </button>
          )
        ) : null}
      </div>
    </div>
  );
};

export default JobDetailsModal;
