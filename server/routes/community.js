const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { authenticateToken } = require('../middleware/auth');

// GET /api/community/posts?page=1&limit=10 - list posts (paginated, newest first)
router.get('/posts', authenticateToken, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'username points')
        .lean(),
      Post.countDocuments(),
    ]);

    // Attach computed fields
    const enriched = posts.map((p) => {
      const likedByUser = p.likes?.some((id) => id.toString() === req.user._id.toString());
      return {
        ...p,
        likesCount: p.likes?.length || 0,
        commentsCount: p.comments?.length || 0,
        likedByUser,
      };
    });

    res.json({ success: true, posts: enriched, total, page, limit });
  } catch (error) {
    console.error('GET /api/community/posts error', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
});

// POST /api/community/posts - create a new post
router.post('/posts', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Content is too short' });
    }

    const post = new Post({ author: req.user._id, content: content.trim() });
  await post.save();
  await post.populate('author', 'username points');

  res.status(201).json({ success: true, post });
  } catch (error) {
    console.error('POST /api/community/posts error', error);
    res.status(500).json({ success: false, message: 'Failed to create post' });
  }
});

// POST /api/community/posts/:id/like - toggle like
router.post('/posts/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const uid = req.user._id.toString();
    const existing = post.likes.find((id) => id.toString() === uid);
    if (existing) {
      // remove like
      post.likes = post.likes.filter((id) => id.toString() !== uid);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ success: true, likesCount: post.likes.length, likedByUser: !existing });
  } catch (error) {
    console.error('POST /api/community/:id/like error', error);
    res.status(500).json({ success: false, message: 'Failed to toggle like' });
  }
});

// POST /api/community/posts/:id/comment - add comment
router.post('/posts/:id/comment', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 1) {
      return res.status(400).json({ success: false, message: 'Comment is empty' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

  post.comments.push({ author: req.user._id, text: text.trim() });
  await post.save();
  // populate the comment author for the response
  await post.populate('comments.author', 'username');
  const latestComment = post.comments[post.comments.length - 1];

  res.status(201).json({ success: true, comment: latestComment });
  } catch (error) {
    console.error('POST /api/community/:id/comment error', error);
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
});

// DELETE /api/community/posts/:id - delete (owner or admin)
router.delete('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await post.remove();
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('DELETE /api/community/posts/:id error', error);
    res.status(500).json({ success: false, message: 'Failed to delete post' });
  }
});

module.exports = router;
