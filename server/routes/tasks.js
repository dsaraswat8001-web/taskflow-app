const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/tasks
// @desc    Get all tasks for the logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, priority, sort = 'createdAt', order = 'desc', search } = req.query;

    const filter = { user: req.user.userId };

    if (status && ['todo', 'in-progress', 'done'].includes(status)) {
      filter.status = status;
    }
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      filter.priority = priority;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const tasks = await Task.find(filter).sort({ [sort]: sortOrder });

    const stats = {
      total: await Task.countDocuments({ user: req.user.userId }),
      todo: await Task.countDocuments({ user: req.user.userId, status: 'todo' }),
      inProgress: await Task.countDocuments({ user: req.user.userId, status: 'in-progress' }),
      done: await Task.countDocuments({ user: req.user.userId, status: 'done' })
    };

    res.json({ tasks, stats });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', [
  body('title').trim().notEmpty().withMessage('Task title is required').isLength({ max: 200 }),
  body('description').optional().isLength({ max: 1000 }),
  body('status').optional().isIn(['todo', 'in-progress', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { title, description, status, priority, dueDate, tags } = req.body;

  try {
    const task = new Task({
      user: req.user.userId,
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: tags || []
    });

    await task.save();
    res.status(201).json({ task, message: 'Task created successfully.' });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Failed to create task.' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get a single task
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch task.' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', [
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('status').optional().isIn(['todo', 'in-progress', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ task, message: 'Task updated successfully.' });
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Failed to update task.' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task.' });
  }
});

// @route   PATCH /api/tasks/:id/status
// @desc    Quick status toggle
// @access  Private
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['todo', 'in-progress', 'done'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { $set: { status } },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status.' });
  }
});

module.exports = router;
