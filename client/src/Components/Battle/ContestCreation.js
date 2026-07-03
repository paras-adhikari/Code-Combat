import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ContestCreation = () => {
  const [contests, setContests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/contest/all`);
        setContests(response.data); // Assuming response contains contests with `_id`, `name`, `startTime`, and `endTime`
      } catch (error) {
        console.error('Error fetching contests:', error);
      }
    };
    fetchContests();
  }, []);

  // Function to handle joining a contest
  const joinContest = (contestId) => {
    
    navigate(`/contest/${contestId}/`); // Navigate to contest details
  };
  const getBackgroundColor = (index) => {
    const colors = ['bg-green-600', 'bg-blue-600', 'bg-purple-600'];
    return colors[index % colors.length]; // Cycle through colors
  };


  return (
    <div className=" h-screen mx-auto p-6 mt-36 mb-40">
      <h2 className="text-3xl font-bold text-white text-center mb-6">Available Contests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contests.length > 0 ? (
          contests.map((contest,index) => (
            <div
              key={contest._id}
              className={`block rounded-lg  ${getBackgroundColor(index)} shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700`}>
              <div
                className="relative overflow-hidden bg-cover bg-no-repeat">
                <img
                  className="rounded-t-lg"
                  src="https://tecdn.b-cdn.net/img/new/standard/nature/186.jpg"
                  alt={contest.name}
                />
                <a href="#!">
                  <div
                    className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
                </a>
              </div>
              <div className="p-6">
                <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                  {contest.name}
                </h5>
                {/* <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
                  Start Time: {new Date(contest.startTime).toLocaleString()}
                </p> */}
                <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
                  {contest.description}
                </p>
                <button
                  onClick={() => joinContest(contest._id)}
                  type="button"
                  className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-white font-semibold text-sm shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition">
                       Join Contest
                </button>

              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-2xl text-gray-300 col-span-full">
            <p>😞 Sorry, no contests are available right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestCreation;
