import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useOutletContext, Link } from "react-router-dom";

interface Job {
  _id: string;
  job_role: string;
  description: string;
  job_type: "Hybrid" | "Remote" | "OnSite";
  location?: string;
  createdAt: string;
  applicants: object[];
}

interface LayoutContextType {
  setShowJobModal: (val: boolean) => void;
}

export default function MyJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const { setShowJobModal } = useOutletContext<LayoutContextType>();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await api.get(`/jobs/my/${user?.role_id}`);
        setJobs(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user?.role === "employer") {
      fetchMyJobs();
    }
  }, [user]);

  return (
    <div className="p-4 sm:p-6 md:p-8 mx-auto max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">My Job Listings</h1>
        <button
          onClick={() => setShowJobModal(true)}
          className="border-2 bg-blue-600 text-white py-2 px-4 rounded-full cursor-pointer text-base transition hover:scale-105"
        >
          Add Job
        </button>
      </div>

      {jobs.length === 0 && (
        <p className="text-gray-600">You haven't posted any jobs yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-5 rounded-lg shadow hover:shadow-md transition flex flex-col justify-between"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-2">{job.job_role}</h2>
            <p className="text-gray-600 mb-3 text-sm">
              {job.description.slice(0, 100)}...
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">
              Type: {job.job_type}
            </p>
            {job.location && job.job_type !== "Remote" && (
              <p className="text-xs sm:text-sm text-gray-500 mb-1">
                Location: {job.location}
              </p>
            )}
            <p className="text-xs sm:text-sm text-gray-500 mb-2">
              Posted: {new Date(job.createdAt).toLocaleDateString()}
            </p>
            <Link
              to={`/job/${job._id}/applicants`}
              className="text-blue-600 font-semibold hover:underline text-sm"
            >
              Applicants: {job.applicants.length}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
