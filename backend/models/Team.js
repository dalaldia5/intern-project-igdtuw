const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    members: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            role: { type: String, default: 'member' },
        },
    ],
    inviteCode: {
        type: String,
        default: () => nanoid(8), // Generates a random 8-character code
        unique: true,
    },
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;