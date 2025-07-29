const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Route to create a new task
// Full URL will be: POST /api/tasks
router.route('/')
    .post(protect, createTask)
    .get(protect, getTasks);

// This will handle updating a specific task
router.route('/:id')
    .put(protect, updateTask)
    .delete(protect, deleteTask);

module.exports = router;