import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Ellipse from "../assets/Ellipse 20@1x.png";
import RectangleTop from "../assets/Rectangle 3@1x.png";
import RectangleBottom from "../assets/Rectangle 1@3x.png";

const ContestCreationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const correctEmail = "shubh@gmail.com";
    const correctPassword = "12345678";

    if (loginData.email === correctEmail && loginData.password === correctPassword) {
      setIsLoggedIn(true);
      setError(null);
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contest/create`, formData);
      setSuccessMessage("Contest created successfully!");
      setError(null);
      setFormData({
        name: "",
        description: "",
      });
    } catch (err) {
      setError("Failed to create contest. Please try again.");
      setSuccessMessage("");
    }
  };

  if (!isLoggedIn) {
    return (
      <>
      <Navbar/>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 relative">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
        
        </div>

        {/* Login Form */}
        <div className="bg-gray-700 p-8 rounded-lg shadow-lg w-full max-w-md z-10">
          <h1 className="text-3xl font-semibold text-white mb-4 text-center">Admin Login</h1>
          {error && <div className="text-red-600 text-center mb-4">{error}</div>}
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-white font-medium">
                Admin Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-white font-medium">
                Admin Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        
        </div>      

      <div className="bg-gray-700 p-8 rounded-lg shadow-lg w-full max-w-md z-10">
        <h1 className="text-3xl font-semibold text-white mb-4 text-center">
          Create a New Contest
        </h1>

        {successMessage && <div className="text-green-600 text-center mb-4">{successMessage}</div>}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-white font-medium">
              Contest Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-white font-medium">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              rows="4"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Create Contest
            </button>
          </div>
          <button
            onClick={() => navigate("/battle")}
            className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContestCreationPage;
