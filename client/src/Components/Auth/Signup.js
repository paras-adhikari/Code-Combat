import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import { useUser } from '../../Contexts/UserContext';

const Signup = () => {
  const { login } = useUser();
  const [userData, setUserData] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!userData.username.trim()) tempErrors.username = "Username is required";
    if (!userData.email) tempErrors.email = "Email is required";
    if (!userData.password || userData.password.length < 8) tempErrors.password = "Password must be at least 8 characters";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => setUserData({ ...userData, [e.target.id]: e.target.value });

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/signup`,
        userData,
        { timeout: 10000 }
      );
      login(response.data);
      navigate('/login');
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        setErrors({ backend: 'Server is taking too long to respond. Please try again in a moment.' });
      } else if (!error.response) {
        setErrors({ backend: 'Cannot reach the server. Please check your connection or try again later.' });
      } else {
        setErrors({ backend: error.response.data?.message || 'Signup failed, try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  /* const handleGoogleLogin = async (response) => {
    if (response.error) return alert('Google login failed');
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, { idToken: response.credential });
      login(res.data);
      navigate('/');
    } catch (error) {
      alert('Google signup failed');
    }
  }; */

  return (
    <>
      <Navbar/>
    <section className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center">Signup</h2>
        <form className="mt-6 space-y-4" onSubmit={submitForm}>
          <div>
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="w-full p-3 bg-gray-700 rounded-md focus:ring-2 focus:ring-purple-500"
              value={userData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
          </div>
          <div>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full p-3 bg-gray-700 rounded-md focus:ring-2 focus:ring-purple-500"
              value={userData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full p-3 bg-gray-700 rounded-md focus:ring-2 focus:ring-purple-500"
              value={userData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-purple-600 hover:bg-purple-700 transition rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing up...' : 'Signup'}
          </button>
          {errors.backend && (
            <p className="text-red-400 text-sm text-center">{errors.backend}</p>
          )}
        </form>
        <div className="mt-4 text-center text-gray-400">
          <Link to="/login" className="hover:text-purple-400">Login</Link>
        </div>
        {/* <div className="mt-6 text-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={(error) => console.error('Google Login Error:', error)}
            theme="dark"
          />
        </div> */}
      </div>
    </section>
    </>
  );
};

export default Signup;
