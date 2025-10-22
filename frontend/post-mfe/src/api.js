// API utility for post-mfe
const API_URL = 'http://localhost:4002';

export async function fetchPosts() {
  const res = await fetch(`${API_URL}/posts`);
  return res.json();
}

export async function createPost(post) {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  });
  return res.json();
}

export async function likePost(id) {
  const res = await fetch(`${API_URL}/posts/${id}/like`, {
    method: 'PUT'
  });
  return res.json();
}
