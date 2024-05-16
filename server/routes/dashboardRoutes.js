// dashboardRoutes.js

const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const dashboardController = require('../controllers/dashboardController');

// Route to get dashboard data
router.get('/', requireAuth, dashboardController.getDashboardData);

router.get('/memoriesCount', requireAuth, dashboardController.getTotalMemoriesCount);

router.get('/userTags', requireAuth, dashboardController.getUserTagsWithMemoryCounts);

// Route to fetch recent activities
router.get('/recent-activities', requireAuth, dashboardController.getRecentActivities);



module.exports = router;
