import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LeadCard from './LeadCard';
import { useUser } from '../../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const [users, setUsers] = useState([]); // Initialize users as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { user: loggedInUser, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/`);
        setUsers(response.data.leaderboard || []); // Ensure it's always an array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this profile? This cannot be undone."
    );
    if (!confirmed) return;

    setDeletingId(userId);
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/user/${userId}`);
      setUsers((prev) => prev.filter((u) => String(u._id) !== String(userId)));

      // If the deleted profile is the currently logged-in user, log them out
      if (loggedInUser?.userId === String(userId)) {
        logout();
        navigate('/');
      }
    } catch (err) {
      alert("Failed to delete profile. Please try again.");
      console.error("Error deleting profile:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle loading and error
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='w-full max-w-md bg-gray-800 rounded-2xl p-6 flex flex-col gap-4'>
      <div className='flex items-center justify-center text-3xl font-bold text-white'>Leaderboard</div>
      <div className='flex flex-col gap-2'>
        {users.length > 0 ? (
          users.map((user, index) => (
            <LeadCard
              key={user._id}
              user={user}
              index={index}
              canDelete={loggedInUser?.userId === String(user._id)}
              onDelete={() => handleDelete(user._id)}
              deleting={deletingId === user._id}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center">No leaderboard data yet.</p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
