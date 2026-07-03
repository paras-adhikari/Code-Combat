import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JoinTeam = ({ contestId }) => {
  const [teamName, setTeamName] = useState('');
  const [passkey, setPasskey] = useState('');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/contest/${contestId}/teams`);
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, [contestId]);

  const joinTeam = async () => {
    if (!teamName || !passkey) {
      alert('Please provide a team name and passkey');
      return;
    }

    const team = teams.find(t => t.name === teamName);
    if (!team) {
      alert('Team not found');
      return;
    }

    if (team.passkey !== passkey) {
      alert('Invalid passkey');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contest/${contestId}/team/join`, { teamName, passkey });
      alert('Successfully joined the team');
    } catch (error) {
      console.error('Error joining team:', error);
      alert('Failed to join team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Join an Existing Team</h3>
        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Passkey"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
        />
        <button onClick={joinTeam} disabled={loading}>
          {loading ? 'Joining Team...' : 'Join Team'}
        </button>
      </div>
    </div>
  );
};

export default JoinTeam;
