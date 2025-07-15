import React, { useState } from "react";
import api from "../services/api";
import { AxiosError } from "axios";

interface RegisterModalProps {
  onClose: () => void;
  setShowLoginModal: (val: boolean) => void
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, setShowLoginModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"employer" | "applicant">("applicant");
  const [skills, setSkills] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        phone,
        password,
        role,
      });

      if (res.data.success && res.data.data && res.data.data._id) {
        const userId = res.data.data._id;

        if (role === "applicant") {
          await api.post("/applicants/", {
            user: userId,
            skills,
          });
        } else if (role === "employer") {
          await api.post("/employers/", {
            user: userId,
          });
        }

        setSuccess("Registered successfully! You can now log in.");
      } else {
        setError("Registration failed.");
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgb(0,0,0,0.4)] bg-opacity-40 flex justify-center items-center z-3 register px-4 md:mx-0 max-h-screen">
      <div className="bg-white rounded-xl p-8 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 mb-4 text-center">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block mb-2 font-semibold">Phone</label>
          <input
            type="tel"
            placeholder="e.g. +91 9876543210"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label className="block mb-2 font-semibold">Role</label>
          <select
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value as "employer" | "applicant")}
            required
          >
            <option value="applicant">Applicant</option>
            <option value="employer">Employer</option>
          </select>

          {role === "applicant" && (
            <>
              <label className="block mb-2 font-semibold">Skills</label>
              <input
                type="text"
                placeholder="e.g. JavaScript, React, Node.js"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
              />
            </>
          )}

          <label className="block mb-2 font-semibold">Password</label>
          <input
            type="password"
            placeholder="Create a strong password"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="block mb-2 font-semibold">Confirm Password</label>
          <input
            type="password"
            placeholder="Re-enter your password"
            className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
          <p className="text-gray-500 text-center mt-3">
            or Have an Account
          </p>

          <button onClick={() => {
            setShowLoginModal(true);
            onClose();
          }} className="w-full border border-blue-600 text-blue-600 rounded-full py-2 hover:bg-gray-100 mt-2 cursor-pointer">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
