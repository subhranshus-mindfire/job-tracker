import React, { useState } from "react";
import api from "../services/api";
import { useAlert } from "../context/AlertContext";

interface JobModalProps {
  onClose: () => void;
  employerId: string;
}

const JobModal: React.FC<JobModalProps> = ({ onClose, employerId }) => {
  const [jobRole, setJobRole] = useState("");
  const [description, setDescription] = useState("");
  const [jobType, setJobType] = useState<"Hybrid" | "Remote" | "OnSite">("Hybrid");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { showAlert } = useAlert()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload: object = {
        employer: employerId,
        job_role: jobRole,
        description,
        job_type: jobType,
        location
      };

      console.log(payload)

      const res = await api.post("/jobs", payload);

      if (res.data.success) {
        showAlert("Job Added", "success")
      } else {
        showAlert("Failed to Post Job.", "error")
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err != undefined) showAlert(err?.response?.data.message, "error")
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgb(0,0,0,0.4)] bg-opacity-50 flex justify-center items-center z-50 px-4 md:mx-0">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Post a New Job</h2>

        {error && <p className="text-red-600 mb-4 text-center capitalize">{error}</p>}
        {success && <p className="text-green-600 mb-4 text-center capitalize">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Job Role</label>
          <input
            type="text"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            required
          />

          <label className="block mb-2 font-semibold">Description</label>
          <textarea
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label className="block mb-2 font-semibold">Job Type</label>
          <select
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={jobType}
            onChange={(e) =>
              setJobType(e.target.value as "Hybrid" | "Remote" | "OnSite")
            }
            required
          >
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
            <option value="OnSite">OnSite</option>
          </select>

          {jobType !== "Remote" && (
            <>
              <label className="block mb-2 font-semibold">Location</label>
              <input
                type="text"
                className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobModal;
