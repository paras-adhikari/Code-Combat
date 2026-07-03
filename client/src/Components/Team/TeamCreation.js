import React, { useState } from 'react';
import axios from 'axios';

const CreateTeam = ({ contestId }) => {
  const [teamName, setTeamName] = useState('');
  const [passkey, setPasskey] = useState('');
  const [teamSize, setTeamSize] = useState(''); // State for team size
  const [loading, setLoading] = useState(false);

  const createTeam = async () => {
    if (!teamName || !passkey || !teamSize) {
      alert('Please fill in all fields: team name, passkey, and team size');
      return;
    }

    setLoading(true);
    try {
      const teamData = {
        teamName,
        passkey,
        teamSize,  // Include teamSize in the data sent to the server
        contestId
      };

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contest/${contestId}/team/create`, teamData);
      alert('Team created successfully');
      setTeamName('');
      setPasskey('');
      setTeamSize('');
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Create a New Team</h3>
        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Set Passkey"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
        />
        <input
          type="number"
          placeholder="Team Size"
          value={teamSize}
          onChange={(e) => setTeamSize(e.target.value)}
          min="1" // Ensure at least 1 member is allowed
        />
        <button onClick={createTeam} disabled={loading}>
          {loading ? 'Creating Team...' : 'Create Team'}
        </button>
      </div>
    </div>
  );
};

export default CreateTeam;
