import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../Contexts/UserContext';
import Navbar from '../Components/Navbar/Navbar';

const TeamCreation = () => {
  const { contestId } = useParams();
  const { user } = useUser();
  const [contest, setContest] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState(2);
  const [passkey, setPasskey] = useState('');
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [userTeam, setUserTeam] = useState(null);
  const [joinPasskey, setJoinPasskey] = useState('');
  const [teamToJoin, setTeamToJoin] = useState(null);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/contest/${contestId}`);
        setContest(response.data);
      } catch (error) {
        console.error('Error fetching contest:', error);
      }
    };
    fetchContest();
  }, [contestId]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/contest/${contestId}/teams`);
        setTeams(response.data);
        const joinedTeam = response.data.find((team) => team.members.includes(user.userId));
        setUserTeam(joinedTeam);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchTeams();
  }, [contestId, user, userTeam]);

  const createTeam = async () => {
    if (!teamName || teamSize <= 0 || !passkey) {
      alert('Please provide a team name, a valid team size, and a passkey.');
      return;
    }

    setLoading(true);
    const teamData = {
      teamName,
      teamSize,
      passkey,
      contestId,
      members: [user.userId],
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/contest/${contestId}/team/create`,
        teamData
      );
      setTeams((prevTeams) => [...prevTeams, response.data]);
      setUserTeam(response.data);
      setTeamName('');
      setTeamSize(2);
      setPasskey('');
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = (team) => {
    setTeamToJoin(team);
    setShowPasskeyModal(true);
  };

  const joinTeam = async () => {
    if (!joinPasskey) {
      alert('Please enter the passkey to join the team.');
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/contest/${contestId}/team/${teamToJoin._id}/join`,
        { userId: user.userId, passkey: joinPasskey }
      );

      setTeams((prevTeams) =>
        prevTeams.map((t) => (t._id === teamToJoin._id ? response.data.team : t))
      );
      setUserTeam(response.data.team);
      setShowPasskeyModal(false);
      setJoinPasskey('');
      setTeamToJoin(null);
    } catch (error) {
      console.error('Error joining team:', error.response?.data || error.message);
      alert('Invalid passkey or error joining the team.');
    }
  };

  useEffect(() => {
    if (userTeam && userTeam.members?.length >= userTeam.teamSize) {
      navigate(`/contest/${contestId}/team/${userTeam._id}/code-editor`);
    }

    const intervalId = setInterval(() => {
      window.location.reload();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [userTeam, contestId, navigate]);

  return (
    <>
      <Navbar/>
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h2 className="text-4xl font-bold text-indigo-600 mb-6">{contest?.name || 'Team Creation'}</h2>

      {userTeam ? (
        <div className="bg-green-600 text-white px-6 py-3 rounded-lg mb-6 text-center w-full max-w-3xl">
          You have joined the team <strong>{userTeam.teamName}</strong>. Wait for teammates.
        </div>
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl">
          <h3 className="text-2xl font-semibold text-blue-400 mb-4 text-center">Create a Team</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-500 rounded text-white"
            />
            <input
              type="number"
              placeholder="Team Size"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              min="1"
              className="w-full p-3 bg-gray-700 border border-gray-500 rounded text-white"
            />
            <input
              type="password"
              placeholder="Set a Passkey"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-500 rounded text-white"
            />
          </div>
          <button
            onClick={createTeam}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Creating Team...' : 'Create Team'}
          </button>
        </div>
      )}

      <h3 className="text-2xl font-bold mt-8 mb-4">Available Teams</h3>
      <div className="w-full max-w-4xl overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <div key={team._id} className="border rounded-lg shadow p-4 bg-gray-800">
            <h4 className="text-lg font-semibold text-gray-300">{team.teamName}</h4>
            <p className="text-sm text-gray-400">
              Members: {team.members?.length || 0}/{team.teamSize}
            </p>
            <button
              onClick={() => handleJoinTeam(team)}
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded w-full hover:bg-green-600"
            >
              Join Team
            </button>
          </div>
        ))}
      </div>

      {showPasskeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold mb-4 text-white">Enter Passkey</h3>
            <input
              type="password"
              value={joinPasskey}
              onChange={(e) => setJoinPasskey(e.target.value)}
              className="mb-4 p-3 bg-gray-700 border border-gray-500 rounded w-full text-white"
              placeholder="Enter the passkey"
            />
            <button onClick={joinTeam} className="w-full bg-blue-500 py-2 rounded hover:bg-blue-600">
              Join Team
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default TeamCreation;
