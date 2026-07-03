import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Contexts/UserContext";
import Stats from "./Stats";
import profilePic from "../../assets/profile.png";

const ProfileCard = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [editGithub, setEditGithub] = useState(false);
  const [editLinkedin, setEditLinkedin] = useState(false);
  const [newGithub, setNewGithub] = useState("");
  const [newLinkedin, setNewLinkedin] = useState("");

  // Ensures links open externally (e.g. "github.com/x" becomes "https://github.com/x")
  // instead of being treated as a relative path on our own site.
  const normalizeUrl = (url) => {
    if (!url) return "";
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  useEffect(() => {
    if (user) {
      const userId = user.userId;

      const fetchUserProfile = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/${userId}`);
          setGithub(response.data.user.github || "");
          setLinkedin(response.data.user.linkedin || "");
        } catch (err) {
          setError("Failed to fetch user data. Please refresh the page.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserProfile();
    }
  }, [user]);

  const saveGithub = async () => {
    try {
      const normalized = normalizeUrl(newGithub.trim());
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/user/update/${user.userId}`, { github: normalized });
      setGithub(normalized);
      setEditGithub(false);
    } catch (error) {
      console.error("Error updating GitHub:", error);
      alert("Failed to update GitHub. Please try again.");
    }
  };

  const saveLinkedin = async () => {
    try {
      const normalized = normalizeUrl(newLinkedin.trim());
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/user/update/${user.userId}`, { linkedin: normalized });
      setLinkedin(normalized);
      setEditLinkedin(false);
    } catch (error) {
      console.error("Error updating LinkedIn:", error);
      alert("Failed to update LinkedIn. Please try again.");
    }
  };

  const deleteProfile = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your profile? This cannot be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/user/${user.userId}`);
      logout();
      navigate("/");
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("Failed to delete profile. Please try again.");
      setDeleting(false);
    }
  };

  if (!user) {
    return <p className="text-white text-center mt-5">Please log in to view your profile.</p>;
  }

  return (
    <div className="bg-gray-800 shadow-lg w-full max-w-5xl mx-auto rounded-2xl relative p-6 pt-20 flex flex-col items-center">
      {/* Profile Image */}
      <div className="bg-gray-700 h-[140px] w-[140px] rounded-full absolute -top-16 flex items-center justify-center overflow-hidden shadow-md border-4 border-gray-600">
        <img src={profilePic} alt="Profile" className="h-full w-full object-cover" />
      </div>

      {/* User Name */}
      <div>
        <p className="text-white font-semibold text-2xl">{user.username}</p>
      </div>

      {loading && (
        <p className="text-gray-400 text-sm mt-2">Loading profile...</p>
      )}
      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}

      {/* Social Links */}
      <div className="flex flex-wrap justify-center gap-8 mt-4 w-full">
        {/* GitHub */}
        <div className="flex flex-col items-center">
          {github ? (
            <a href={github} target="_blank" rel="noopener noreferrer" className="w-full">
              <div className="bg-gray-900 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 
                              hover:bg-gray-700 hover:scale-105 active:scale-95 shadow-md cursor-pointer">
                GitHub
              </div>
            </a>
          ) : (
            <div className="bg-gray-900 text-gray-500 font-semibold px-6 py-2 rounded-full shadow-md cursor-default">
              GitHub
            </div>
          )}
          {editGithub ? (
            <div className="mt-2 flex flex-col items-center">
              <input
                type="text"
                value={newGithub}
                onChange={(e) => setNewGithub(e.target.value)}
                className="p-2 text-black rounded-lg w-64 outline-none border-2 border-gray-500"
                placeholder="Enter new GitHub URL"
              />
              <button onClick={saveGithub} className="mt-1 px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
                Save
              </button>
            </div>
          ) : (
            <button onClick={() => { setEditGithub(true); setNewGithub(github); }} 
                    className="text-sm text-gray-400 hover:text-white mt-1 transition-all">
              Edit
            </button>
          )}
        </div>

        {/* LinkedIn */}
        <div className="flex flex-col items-center">
          {linkedin ? (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="w-full">
              <div className="bg-gray-900 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 
                              hover:bg-gray-700 hover:scale-105 active:scale-95 shadow-md cursor-pointer">
                LinkedIn
              </div>
            </a>
          ) : (
            <div className="bg-gray-900 text-gray-500 font-semibold px-6 py-2 rounded-full shadow-md cursor-default">
              LinkedIn
            </div>
          )}
          {editLinkedin ? (
            <div className="mt-2 flex flex-col items-center">
              <input
                type="text"
                value={newLinkedin}
                onChange={(e) => setNewLinkedin(e.target.value)}
                className="p-2 text-black rounded-lg w-64 outline-none border-2 border-gray-500"
                placeholder="Enter new LinkedIn URL"
              />
              <button onClick={saveLinkedin} className="mt-1 px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
                Save
              </button>
            </div>
          ) : (
            <button onClick={() => { setEditLinkedin(true); setNewLinkedin(linkedin); }} 
                    className="text-sm text-gray-400 hover:text-white mt-1 transition-all">
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Stats Component */}
      <Stats />

      {/* Danger Zone */}
      <button
        onClick={deleteProfile}
        disabled={deleting}
        className="mt-6 text-sm text-red-400 hover:text-red-300 border border-red-400/40 hover:border-red-300 rounded-full px-4 py-2 transition-colors disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete My Profile"}
      </button>
    </div>
  );
};

export default ProfileCard;
