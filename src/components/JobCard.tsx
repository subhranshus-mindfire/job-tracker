import React from "react";
import type { Job } from "../pages/Home";

interface JobCardProps {
  job: Job;
  onView: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onView }) => {
  const companyName = job.employer.user.name.replace(/\s+/g, "").toLowerCase();
  const logoUrl = `https://img.logo.dev/${companyName}.com?token=pk_U5pZvgj7Ty2ZWkob2YkBig`;

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-md transition flex flex-col gap-2">
      <div className="absolute top-4 right-4">
        <img
          src={logoUrl}
          alt={job.employer.user.name}
          className="w-10 h-10 object-contain rounded-full"
        />
      </div>

      <h2 className="text-lg md:text-xl font-bold">{job.job_role}</h2>
      <h3 className="text-base md:text-lg font-semibold text-gray-600">{job.employer.user.name}</h3>

      <p className="text-gray-600 text-sm md:text-base">
        <i className="fa-solid fa-location-dot mr-1"></i>
        {job.location ? job.location : "Remote"}
      </p>

      <p className="text-gray-700 text-sm md:text-base overflow-hidden text-ellipsis line-clamp-3 hidden md:block">
        {job.description.slice(0, 120)}...
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-auto gap-2">
        <p className="text-xs text-gray-500">
          Posted: {new Date(job.createdAt).toLocaleDateString()}
        </p>

        <button
          className="px-4 py-2 bg-blue-600 text-white text-sm md:text-base rounded hover:bg-blue-700 transition"
          onClick={() => onView(job)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default JobCard;
