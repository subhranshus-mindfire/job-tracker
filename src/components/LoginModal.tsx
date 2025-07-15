import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"


interface LoginModalProps {
  onClose: () => void;
  setShowRegisterModal: (val: boolean) => void
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, setShowRegisterModal }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate()


  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      onClose();
      navigate("/")
    } catch (err) {
      console.log(err)
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] flex justify-center items-center z-50 px-4 md:mx-0">
      <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-3xl cursor-pointer"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-6 text-center">Login</h2>

        <label className="block text-sm font-semibold mb-1">
          Email ID
        </label>
        <input
          type="text"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-full px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-sm font-semibold mb-1">Password</label>
        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-4 py-2 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:underline"
          >
            {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
          </button>
        </div>

        {error && (
          <p className="text-red-600 mb-2 text-sm">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-full py-2 hover:bg-blue-700 mt-8 cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-gray-500 text-center mt-3">
          Or new to our platfrom
        </p>

        <button disabled={loading} onClick={() => {
          setShowRegisterModal(true);
          onClose()
        }} className="w-full border border-blue-600 text-blue-600 rounded-full py-2 hover:bg-gray-100 mt-2 cursor-pointer">
          Register
        </button>

      </div>
    </div>
  );
};

export default LoginModal;
