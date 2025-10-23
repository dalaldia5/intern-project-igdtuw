const Task = require('../models/Task.js');

/**
 * @desc    Create a new task for a team
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo } = req.body;

        // User must be in a team to create a task
        if (!req.user.teamId) {
            return res.status(400).json({ message: 'You must be in a team to create tasks' });
        }

        if (!title) {
            return res.status(400).json({ message: 'Please enter a task title' });
        }

        const task = new Task({
            title,
            description,
            assignedTo,
            team: req.user.teamId, // Task ko user ki team se jodo
            createdBy: req.user._id, // Task banane wale user ki ID
        });

        const createdTask = await task.save();
        res.status(201).json(createdTask);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getTasks = async (req, res) => {
    try {
        if (!req.user.teamId) {
            return res.status(400).json({ message: 'You are not part of any team' });
        }
        const tasks = await Task.find({ team: req.user.teamId })
            .populate('createdBy', 'name email')
            .populate('assignedTo', 'name email');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateTask = async (req, res) => {
    try {
        const { title, description, status, assignedTo } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Make sure the task belongs to the user's team
        if (task.team.toString() !== req.user.teamId.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.assignedTo = assignedTo || task.assignedTo;

        const updatedTask = await task.save();
        res.status(200).json(updatedTask);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Make sure the task belongs to the user's team
        if (task.team.toString() !== req.user.teamId.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Task removed successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
};