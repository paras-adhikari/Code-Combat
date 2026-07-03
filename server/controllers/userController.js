const User = require('../models/User');

// Fetch user profile by userId (publicly accessible)
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params; // Use userId from the URL parameters for public access
  try {
    const user = await User.findById(userId); // Fetch the user by userId
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const {userId} = req.params; // `req.user` is populated by authentication middleware
    const updates = req.body; // Get updates from request body
    console.log(updates)

    if (!updates) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    
    //  when a user joins a contest, increase the contestsParticipated count:
    // if (updates.joinedContest) {
    //   updates.contestsParticipated = req.user.contestsParticipated + 1; // Increase contest participation count
    // }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    // Fetch users, sorted by rating in descending order
    const users = await User.find()
      .select('username statistics.rating')
      .sort({ 'statistics.rating': -1 })
      .limit(10);
    // Add rank based on the sorted order
    const leaderboard = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1, // Rank starts from 1
    }));
    
    res.status(200).json({
      message: 'Leaderboard fetched successfully',
      leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find(); // You can customize this query as needed
    res.status(200).json(users); // Send the users as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user's profile/account
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateContestStats = async (req, res) => {
  const { userId } = req.params; // Extract userId from route parameters
  const { rating } = req.body; // Use the rating increment from request body

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Increment contestsParticipated
    user.statistics.contestsParticipated += 1; 

    // Calculate the new average rating
    const totalRating = user.statistics.rating + rating; // Add the new rating to the current rating
    user.statistics.rating = totalRating / user.statistics.contestsParticipated; // Calculate the new average

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: 'User contest stats updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating contest stats:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

