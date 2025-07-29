const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    team: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Team', // Kaunsi team ka task hai
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'], // Sirf ye teen values ho sakti hain
        default: 'To Do',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Kisko assign kiya gaya hai
        default: null,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Kisne banaya
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);