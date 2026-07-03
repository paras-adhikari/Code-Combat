import React, { useEffect, useState } from 'react'
import StatusGraph from './StatusGraph'
import { useUser } from '../../Contexts/UserContext'; // Import the custom hook
import axios from 'axios';

const Stats = () => {
  const [error, setError] = useState(null); // State to store error message
  const [loading, setLoading] = useState(true); // State for loading indicator
  const { user } = useUser(); 
  const [userData, setUserData] = useState({
    contestsParticipated: 0,
    rank: 0,
    rating: 0,
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
  return (
    <div className='w-full max-w-5xl mx-auto rounded-xl flex flex-col gap-3 mt-6'>
      <div className='status w-full flex flex-wrap justify-around items-center gap-6'>
         <div className='flex flex-col gap-0.5 w-1/3 items-center justify-center'><div className='h-16 w-16 bg-indigo-400 rounded-full flex items-center justify-center'><p className='text-white font-bold text-lg'>{userData.contestsParticipated}</p></div><p className='font-semibold text-lg text-white'>Total Combat</p></div>
         <div className='flex flex-col gap-0.5 w-1/3 items-center justify-center'><div className='h-16 w-16 bg-indigo-400 rounded-full flex items-center justify-center'><p className='text-white font-bold text-lg' >{userData.rank}</p></div><p className='font-semibold text-lg text-white'>Rank</p></div>
         <div className='flex flex-col gap-0.5 w-1/3 items-center justify-center'><div className='h-16 w-16 bg-indigo-400 rounded-full flex items-center justify-center'><p className='text-white font-bold text-lg'>{Math.ceil(userData.rating)}</p></div><p className='font-semibold text-lg text-white'>Rating</p></div>
      </div>
    </div>  
  )
}
export default Stats
