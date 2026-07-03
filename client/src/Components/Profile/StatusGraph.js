import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useUser } from '../../Contexts/UserContext'; // Import the custom hook

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusGraph = () => {
  const [error, setError] = useState(null); // State to store error message
  const [loading, setLoading] = useState(true); // State for loading indicator
  const { user } = useUser(); 
  const [userData, setUserData] = useState({
    contestsParticipated: 0,
    contestsWon: 0,
    contestsLost: 0,
  });

  useEffect(() => {
    // Fetch only when user is available
    if (user?.userId) {
      const fetchUserStats = async () => {
        try {
          const userId = user.userId;
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/${userId}`);
          setUserData(response.data.user.statistics);
          
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch user statistics');
          setLoading(false);
        }
      };

      fetchUserStats();
    }
  }, [user]); // Dependency on user to refetch when it changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Calculate percentages for the Doughnut chart
  const totalCombats = userData.contestsParticipated || 1; // Prevent division by zero
  const rating = (userData.rating || 0) * 100;
  // const combatsLostPercentage = ((userData.contestsLost || 0) / totalCombats) * 100;

  const data = {
    datasets: [
      {
        label: 'Statistics',
        data: [rating, totalCombats],
        backgroundColor: ['MediumSeaGreen', 'slateblue'],
        borderColor: ['MediumSeaGreen', 'slateblue'],
      },
    ],
    labels: ['Rating',  'Total combats'],

  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right', // Position legend to the right
        labels: {
          font: {
            size: 14, // Adjust font size for clarity
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-md bg-gray-800 rounded-2xl p-6 flex flex-col items-center gap-4">
      <h3 className="text-xl font-semibold text-white">Performance</h3>
      <div className="w-full max-w-[350px]">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default StatusGraph;
