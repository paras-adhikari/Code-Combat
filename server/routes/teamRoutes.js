// const express = require('express');
// const router = express.Router();
// const  teamController = require('../controllers/teamController');


// // Import your models


// // Create a new team for a contest
// router.post('/:contestId/create-team', teamController.createTeam);

// // Get all teams for a contest
// router.get('/:contestId/teams', teamController.getTeamsByContest);

// // Join an existing team
// router.post('/:contestId/team/:joinCode/member', teamController.joinTeam);

// module.exports = router;

const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController'); // Import the teamController

// Create a new team for a specific contest
router.post('/:contestId/team/create', teamController.createTeam);

// Get all teams for a specific contest
router.get('/:contestId/teams', teamController.getTeamsByContest);

// Get a specific team by its ID
router.get('/team/:teamId', teamController.getTeamById);

router.put('/:contestId/team/:teamId/join', teamController.joinTeam);

router.put('/team/:teamId/score', teamController.updateTeamScore);

router.get('/:teamId/members', teamController.getTeamMembersById);

module.exports = router;
