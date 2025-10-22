const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory dummy storage for posts
let posts = [];
let nextId = 1;

const fs = require('fs');
const path = require('path');

// Serve frontend build if it exists. In many setups the frontend build is
// placed into backend/<service>/build. If it's not present we only expose the
// API endpoints and avoid trying to serve a missing index.html (which caused
// the ENOENT error you saw).
const buildDir = path.join(__dirname, 'build');
const indexHtml = path.join(buildDir, 'index.html');
if (fs.existsSync(indexHtml)) {
  app.use(express.static(buildDir));
  app.get('*', (req, res) => {
    res.sendFile(indexHtml);
  });
} else {
  console.warn(`Frontend build not found at ${indexHtml}. Running API-only mode.`);
  console.warn('If you want the backend to serve the frontend, build the frontend and copy its `build` folder into this directory:');
  console.warn('  cp -r ../frontend/post-mfe/build .');
}

// GET /posts - list all posts
app.get('/posts', (req, res) => {
  res.json(posts);
});

// POST /posts - create a new post
app.post('/posts', (req, res) => {
  const { user, content, category, media } = req.body;
  const post = {
    id: nextId++,
    user: user || { name: 'Demo User', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    content,
    category,
    media,
    likes: 0,
    liked: false,
    comments: 0,
    timestamp: new Date().toISOString()
  };
  posts.unshift(post);
  res.status(201).json(post);
});

// PUT /posts/:id/like - like/unlike a post
app.put('/posts/:id/like', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: 'Post not found' });
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  res.json(post);
});

// Health check
app.get('/', (req, res) => res.send('Post API running'));

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`Post API running on port ${PORT}`));
