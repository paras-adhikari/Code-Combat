import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../Contexts/UserContext";
import { BugPlay } from "lucide-react";
import glb_logo from "../../assets/glb_logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const location = useLocation();

  const logout_ = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      {/* Warning Message Banner */}
      <div className="w-full bg-red-600 text-white text-center py-2 font-semibold">
      Please note: This website is hosted on a free platform. The first time you access the site or after some inactivity, it may take a minute for the backend to start. If something isn't working right away, kindly try again in a minute or less.
      </div>

      {/* Navbar */}
      <div className="w-screen h-16 bg-gray-800 text-white flex items-center px-6 shadow-md">
        {/* Logo & Name on the Left */}
        <Link
          to="/"
          className="flex items-center space-x-3 group hover:text-gray-300 transition-transform duration-300"
        >
          <BugPlay size={42} className="text-violet-300" />
          {/* Text Container */}
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors duration-200">
              CodeCombat
            </span>
            <span className="text-sm text-gray-400">Learn and Grow Together</span>
          </div>
        </Link>

        {/* Navigation Links in the Center */}
        <div className="text-xl flex-1 flex justify-center space-x-16">
          {[ 
            { name: "Resources", path: "/" },
            { name: "Profile", path: "/profile" },
            { name: "Practice", path: "/practice" },
            { name: "Battle Ground", path: "/battle" },
          ].map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              className={`hover:scale-105 transition-transform duration-200 px-3 py-1 rounded-md ${
                location.pathname === path ? "text-indigo-500 font-semibold bg-gray-700" : "hover:text-gray-300"
              }`}
            >
              {name}
            </Link>
          ))}
        </div>

        {/* Authentication Buttons */}
        <div className="flex space-x-4">
          <Link
            to="/admin"
            className={`text-xl px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300 ${
              location.pathname === "/admin" ? "bg-indigo-300 text-white" : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            Admin Panel
          </Link>
          {user ? (
            <button
              onClick={logout_}
              className="text-xl bg-red-600 px-4 py-2 rounded-xl hover:bg-red-500 hover:scale-105 transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-xl px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300 ${
                  location.pathname === "/login" ? "bg-indigo-300 text-white" : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`text-xl px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300 ${
                  location.pathname === "/signup" ? "bg-indigo-300 text-white" : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                Signup
              </Link>
            </>
          )}
        </div>
        <div>
            <img src={glb_logo} alt="Logo" className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
