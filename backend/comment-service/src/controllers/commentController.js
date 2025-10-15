const { validationResult } = require('express-validator');
const pool = require('../config/database');

// Create a new comment
const createComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { postId, content, parentId } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      'INSERT INTO comments (post_id, user_id, content, parent_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [postId, userId, content, parentId || null]
    );

    const comment = result.rows[0];

    res.status(201).json({
      success: true,
      data: {
        id: comment.id,
        postId: comment.post_id,
        userId: comment.user_id,
        content: comment.content,
        parentId: comment.parent_id,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get comments for a post
const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT c.*, u.username, u.avatar_url 
       FROM comments c 
       LEFT JOIN users u ON c.user_id = u.id 
       WHERE c.post_id = $1 
       ORDER BY c.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [postId, limit, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM comments WHERE post_id = $1',
      [postId]
    );

    const total = parseInt(countResult.rows[0].count);

    res.status(200).json({
      success: true,
      data: result.rows.map(comment => ({
        id: comment.id,
        postId: comment.post_id,
        userId: comment.user_id,
        username: comment.username,
        avatarUrl: comment.avatar_url,
        content: comment.content,
        parentId: comment.parent_id,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update a comment
const updateComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Check if comment exists and belongs to user
    const checkResult = await pool.query(
      'SELECT * FROM comments WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    if (checkResult.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this comment'
      });
    }

    const result = await pool.query(
      'UPDATE comments SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [content, id]
    );

    const comment = result.rows[0];

    res.status(200).json({
      success: true,
      data: {
        id: comment.id,
        postId: comment.post_id,
        userId: comment.user_id,
        content: comment.content,
        parentId: comment.parent_id,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a comment
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if comment exists and belongs to user
    const checkResult = await pool.query(
      'SELECT * FROM comments WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    if (checkResult.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this comment'
      });
    }

    await pool.query('DELETE FROM comments WHERE id = $1', [id]);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment
};
