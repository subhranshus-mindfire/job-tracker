import React, { useState, useEffect } from "react";
import api from "../services/api";
import JobCard from "../components/JobCard";
import JobDetailsModal from "../components/JobDetailsModal";
import { useAuth } from "../context/AuthContext";
import { useOutletContext } from "react-router-dom";

interface Employer {
  user: User;
  _id: string;
}

interface User {
  name: string;
  _id: string;
}

interface LayoutContextType {
  setShowLoginModal: () => void;
  setShowRegisterModal: () => void;
}

export interface Job {
  _id: number;
  job_role: string;
  description: string;
  job_type: "Hybrid" | "Remote" | "OnSite";
  location: string;
  createdAt: string;
  updatedAt: string;
  employer: Employer;
}

export default function Home() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [sortBy, setSortBy] = useState<
    "date_desc" | "date_asc" | "title_asc" | "title_desc"
  >("date_desc");
  const [filterType, setFilterType] = useState<Job["job_type"] | "">("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { setShowLoginModal } = useOutletContext<LayoutContextType>();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSortBy(e.target.value as typeof sortBy);

  const handleFilter = (type: Job["job_type"]) =>
    setFilterType(type === filterType ? "" : type);

  const handleApply = async () => {
    if (!selectedJob || !user) return;
    await api.post(`/applications`, {
      applicant: user.role_id,
      job: selectedJob._id,
      status: "applied",
    });
    alert("Applied successfully!");
    setSelectedJob(null);
  };

  const filteredJobs = jobs
    .filter((job) => (filterType ? job.job_type === filterType : true))
    .sort((a, b) => {
      switch (sortBy) {
        case "title_asc":
          return a.job_role.localeCompare(b.job_role);
        case "title_desc":
          return b.job_role.localeCompare(a.job_role);
        case "date_asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "date_desc":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  return (
    <div className="min-h-auto flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white p-6 mt-3 hidden md:block">
        <h2 className="text-xl font-semibold mb-4">Filter By</h2>
        <div className="space-y-2">
          {["Hybrid", "Remote", "OnSite"].map((type) => (
            <button
              key={type}
              className={`block w-full text-left px-4 py-2 rounded ${filterType === type
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200"
                }`}
              onClick={() => handleFilter(type as Job["job_type"])}
            >
              <span className="ms-3 text-lg">{type}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 p-1 md:p-6">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 mt-3">
          <h1 className="text-2xl font-bold text-center">Job Listings</h1>
          <div className="flex justify-center">
            <select
              value={sortBy}
              onChange={handleSort}
              className="p-2 rounded text-center"
            >
              <option value="date_desc">Sort By Date (Newest First)</option>
              <option value="date_asc">Sort By Date (Oldest First)</option>
              <option value="title_asc">Sort By Title (A-Z)</option>
              <option value="title_desc">Sort By Title (Z-A)</option>
            </select>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onView={(job) => setSelectedJob(job)}
            />
          ))}
        </div>
      </main>

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApply}
          canApply={!!user}
          setShowLoginModal={setShowLoginModal}
        />
      )}
    </div>
  );
}
