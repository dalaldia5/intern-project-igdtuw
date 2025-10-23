const Team = require('../models/Team.js');
const User = require('../models/User.js');

// @desc    Create a new team
// @route   POST /api/teams
const createTeam = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Please enter a team name' });
    }

    const team = await Team.create({
        name,
        members: [{ user: req.user._id, role: 'leader' }], // The creator is the leader
    });

    // Also update the user's document to include the teamId
    await User.findByIdAndUpdate(req.user._id, { teamId: team._id });

    res.status(201).json(team);
};

// @desc    Join a team with an invite code
// @route   POST /api/teams/join
const joinTeam = async (req, res) => {
    const { inviteCode } = req.body;

    const team = await Team.findOne({ inviteCode });

    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    }

    const isAlreadyMember = team.members.some(member => member.user.equals(req.user._id));
    if (isAlreadyMember) {
        return res.status(400).json({ message: 'You are already in this team' });
    }

    team.members.push({ user: req.user._id, role: 'member' });
    await team.save();

    await User.findByIdAndUpdate(req.user._id, { teamId: team._id });

    res.status(200).json(team);
};

// @desc    Get details of the user's current team
// @route   GET /api/teams/myteam
const getMyTeam = async (req, res) => {
    if (!req.user.teamId) {
        return res.status(404).json({ message: "You are not part of any team" });
    }

    const team = await Team.findById(req.user.teamId).populate(
        'members.user',
        'name email'
    );

    if (!team) {
        return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json(team);
};


// Export all three functions
module.exports = { createTeam, joinTeam, getMyTeam };