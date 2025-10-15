const express = require('express');
const { body } = require('express-validator');
const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Create comment (protected)
router.post(
  '/',
  authMiddleware,
  [
    body('postId').isInt().withMessage('Post ID must be an integer'),
    body('content').trim().notEmpty().withMessage('Content is required').isLength({ max: 1000 }).withMessage('Content must be less than 1000 characters'),
    body('parentId').optional().isInt().withMessage('Parent ID must be an integer')
  ],
  createComment
);

// Get comments by post ID
router.get('/post/:postId', getCommentsByPost);

// Update comment (protected)
router.put(
  '/:id',
  authMiddleware,
  [
    body('content').trim().notEmpty().withMessage('Content is required').isLength({ max: 1000 }).withMessage('Content must be less than 1000 characters')
  ],
  updateComment
);

// Delete comment (protected)
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
