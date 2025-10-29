const Team = require('../models/Team.js');
const User = require('../models/User.js');

// @desc    Create a new team
// @route   POST /api/teams
const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please enter a team name' });
    }

    // 🧹 Step 1: If user already in a team, remove them from that team
    if (req.user.teamId) {
      const oldTeam = await Team.findById(req.user.teamId);
      if (oldTeam) {
        oldTeam.members = oldTeam.members.filter(
          (m) => !m.user.equals(req.user._id)
        );
        await oldTeam.save();
      }
    }

    // 🆕 Step 2: Create a new team with the user as leader
    const team = await Team.create({
      name,
      members: [{ user: req.user._id, role: 'leader' }],
    });

    // 🔗 Step 3: Update user document
    await User.findByIdAndUpdate(req.user._id, { teamId: team._id });

    res.status(201).json({
      message: 'Team created successfully',
      team,
    });
  } catch (error) {
    console.error('CREATE TEAM ERROR:', error);
    res.status(500).json({ message: 'Server error while creating team' });
  }
};

// @desc    Join a team using invite code
// @route   POST /api/teams/join
const joinTeam = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const team = await Team.findOne({ inviteCode });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const isAlreadyMember = team.members.some((m) =>
      m.user.equals(req.user._id)
    );
    if (isAlreadyMember) {
      return res.status(400).json({ message: 'You are already in this team' });
    }

    // 🧹 If user was in an old team, remove them from there first
    if (req.user.teamId) {
      const oldTeam = await Team.findById(req.user.teamId);
      if (oldTeam) {
        oldTeam.members = oldTeam.members.filter(
          (m) => !m.user.equals(req.user._id)
        );
        await oldTeam.save();
      }
    }

    // ➕ Add user to new team
    team.members.push({ user: req.user._id, role: 'member' });
    await team.save();

    // 🔗 Update user
    await User.findByIdAndUpdate(req.user._id, { teamId: team._id });

    res.status(200).json({
      message: 'Joined team successfully',
      team,
    });
  } catch (error) {
    console.error('JOIN TEAM ERROR:', error);
    res.status(500).json({ message: 'Server error while joining team' });
  }
};

// @desc    Get current user's team details
// @route   GET /api/teams/myteam
const getMyTeam = async (req, res) => {
  try {
    if (!req.user.teamId) {
      return res.status(404).json({ message: 'You are not part of any team' });
    }

    const team = await Team.findById(req.user.teamId)
      .populate('members.user', 'name email')
      .lean();

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json({
      message: 'Fetched team successfully',
      team,
    });
  } catch (error) {
    console.error('GET MY TEAM ERROR:', error);
    res.status(500).json({ message: 'Server error while fetching team' });
  }
};

// @desc    Leave the current team
// @route   POST /api/teams/leave
const leaveTeam = async (req, res) => {
  try {
    // Step 1️⃣: Find user and their team
    const user = req.user;
    if (!user.teamId) {
      return res.status(400).json({ message: "You are not in any team" });
    }

    const team = await Team.findById(user.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Step 2️⃣: Remove the user from the team members array
    team.members = team.members.filter(m => !m.user.equals(user._id));
    await team.save();

    // Step 3️⃣: Remove teamId from user
    await User.findByIdAndUpdate(user._id, { $unset: { teamId: "" } });

    res.status(200).json({
      message: "You have left the team successfully",
    });
  } catch (error) {
    console.error("LEAVE TEAM ERROR:", error);
    res.status(500).json({ message: "Server error while leaving team" });
  }
};



module.exports = { createTeam, joinTeam, getMyTeam, leaveTeam };
