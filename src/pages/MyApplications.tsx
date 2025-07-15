import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Employer {
  user: {
    name: string;
  };
}

interface Job {
  _id: string;
  job_role: string;
  description: string;
  job_type: "Hybrid" | "Remote" | "OnSite";
  location?: string;
  employer: Employer;
}

interface Application {
  _id: string;
  status: "interview" | "hired" | "rejected" | "applied";
  job: Job;
}

export default function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (user?.role_id) {
          const res = await api.get(`/applications/applicant/${user.role_id}`);
          setApplications(res.data.data);
        }
      } catch (err) {
        console.log(err);
        setError("Could not load applications.");
      }
    };

    fetchApplications();
  }, [user]);

  return (
    <div className="p-4 md:p-8 md:mx-20">
      <h1 className="text-3xl font-bold mb-6 text-center">My Applications</h1>

      {error && <p className="text-red-600">{error}</p>}

      {applications.length === 0 && !error && (
        <p className="text-gray-600">You have not applied to any jobs yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {applications.map((app) => {
          const employerName = app.job.employer?.user?.name
            ?.replace(/\s+/g, "")
            .toLowerCase() || "company";
          const logoUrl = `https://img.logo.dev/${employerName}.com?token=pk_U5pZvgj7Ty2ZWkob2YkBig`;

          let statusClass = "";
          if (app.status === "interview") {
            statusClass = "bg-yellow-200 text-yellow-800";
          } else if (app.status === "hired") {
            statusClass = "bg-green-200 text-green-800";
          } else if (app.status === "rejected") {
            statusClass = "bg-red-200 text-red-800";
          }
          else if (app.status === "applied") {
            statusClass = "bg-gray-200 text-black";
          }

          return (
            <div
              key={app._id}
              className="relative bg-white p-6 rounded shadow hover:shadow-md transition "
            >
              <div className="mb-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}
                >
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
              <img
                src={logoUrl}
                alt="Company Logo"
                className="absolute top-4 right-4 w-10 h-10 rounded-full object-cover"
              />

              <h2 className="text-xl font-semibold mb-2">{app.job.job_role}</h2>
              <p className="text-gray-600 mb-2">
                {app.job.description.slice(0, 100)}...
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Type: {app.job.job_type}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Location:{" "}
                {app.job.job_type === "Remote" ? "Remote" : app.job.location}
              </p>


            </div>
          );
        })}
      </div>
    </div>
  );
}
