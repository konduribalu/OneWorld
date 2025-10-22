import React, { useEffect, useState } from 'react';
import './App.css';
import PostComposer from './PostComposer';
import PostList from './PostList';
import { fetchPosts, createPost } from './api';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchPosts()
      .then(data => {
        if (isMounted) {
          setPosts(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError('Failed to load posts.');
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  const handlePostSubmit = async (postData) => {
    try {
      const user = { name: 'Demo User', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' };
      const newPost = await createPost({ ...postData, user });
      setPosts(prev => [newPost, ...prev]);
    } catch (err) {
      setError('Failed to create post.');
    }
  };

  return (
    <main className="App" aria-label="Post Feed">
      <PostComposer onSubmit={handlePostSubmit} />
      {error && <div className="error-message" role="alert">{error}</div>}
      {loading ? (
        <div className="loading-container" aria-busy="true">
          <div className="loading-spinner"></div>
          <span>Loading posts...</span>
        </div>
      ) : (
        <PostList posts={posts} setPosts={setPosts} />
      )}
      <footer className="app-footer" role="contentinfo">
        <small>&copy; {new Date().getFullYear()} OneWorld. All rights reserved.</small>
      </footer>
    </main>
  );
}

export default App;
