const express = require('express');
const router = express.Router();

// Make sure getMyTeam is imported here
const { createTeam, joinTeam, getMyTeam } = require('../controllers/teamController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Route to create a team
router.route('/').post(protect, createTeam);

// Route to join a team
router.route('/join').post(protect, joinTeam);

// Make sure this line exists
router.route('/myteam').get(protect, getMyTeam);

module.exports = router;