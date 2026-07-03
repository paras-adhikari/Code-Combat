const express = require('express');
const router = express.Router();
const { updateUserProfile,getUserProfile,getLeaderboard, updateContestStats, getAllUsers, deleteUser } = require('../controllers/userController'); // Ensure the correct path
const { isAuthenticated } = require('../middleware/auth'); // Assuming the middleware is correctly implemented


// Route to get user profile (including statistics)
router.get('/:userId', getUserProfile);
// router.get('/', getAllUsers);
router.put('/update/:userId', updateUserProfile);
router.get('/',getLeaderboard)
router.put('/:userId', updateContestStats);
router.delete('/:userId', deleteUser);


module.exports = router;
