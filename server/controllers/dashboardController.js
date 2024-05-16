// controllers/dashboardController.js

const User = require('../models/userModel');
const Memory = require('../models/Memory');

const calculateDaysWeeksMonthsLived = (dob) => {
  const currentDate = new Date();
  const dateOfBirth = new Date(dob);
  
  // Calculate difference in milliseconds
  const difference = currentDate - dateOfBirth;
  
  // Convert milliseconds to days
  const daysLived = Math.floor(difference / (1000 * 60 * 60 * 24));
  
  // Calculate weeks lived
  const weeksLived = Math.floor(daysLived / 7);
  
  // Calculate months lived
  const monthsLived = Math.floor(daysLived / 30); // Approximate value
  
  return { daysLived, weeksLived, monthsLived };
};

const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    console.log('Date of Birth:', user.dateOfBirth); // Log date of birth
    
    // Calculate days, weeks, and months lived
    const { daysLived, weeksLived, monthsLived } = calculateDaysWeeksMonthsLived(user.dateOfBirth);
    
    console.log('Days Lived:', daysLived); // Log days lived
    console.log('Weeks Lived:', weeksLived); // Log weeks lived
    console.log('Months Lived:', monthsLived); // Log months lived
    
    // Other data retrieval and processing...

    res.json({ daysLived, weeksLived, monthsLived, /* Other data */ });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to get the total number of memories added by the current user
const getTotalMemoriesCount = async (req, res) => {
  try {
    // Find memories added by the current user
    const totalMemoriesCount = await Memory.countDocuments({ userId: req.user._id });
    
    res.status(200).json({ totalMemoriesCount });
    console.log('total memories of user:', totalMemoriesCount);
  } catch (error) {
    console.error('Error fetching total memories count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to get distinct tags and their memory counts for the current user
const getUserTagsWithMemoryCounts = async (req, res) => {
  try {
    // Find distinct tags used by the current user
    const distinctTags = await Memory.distinct('tags', { userId: req.user._id });

    // Initialize an object to store tag counts
    const tagCounts = {};

    // Count memories for each tag
    for (const tag of distinctTags) {
      const memoriesCount = await Memory.countDocuments({ tags: tag, userId: req.user._id });
      tagCounts[tag] = memoriesCount;
    }

    res.status(200).json(tagCounts);
  } catch (error) {
    console.error('Error fetching user tags with memory counts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Controller function to fetch recent activities
const getRecentActivities = async (req, res) => {
  try {
      // Fetch recent memory activities sorted by createdAt in descending order
      const recentActivities = await Memory.find({ userId: req.user._id })
          .sort({ createdAt: -1 })
          .limit(3); // Limit to 3 recent activities
      
      // Map the recent activities to include the date on the calendar
      const mappedActivities = recentActivities.map(activity => ({
        title: activity.title,
        createdAt: activity.createdAt,
        calendarDate: activity.date.toLocaleDateString() // Convert the date to a string in desired format
      }));
          
      res.status(200).json(mappedActivities);
  } catch (error) {
      console.error('Error fetching recent activities:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};




module.exports = { 
  getDashboardData,
  getTotalMemoriesCount, 
  getUserTagsWithMemoryCounts,
  getRecentActivities,
};
