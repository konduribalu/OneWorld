import React, { useState } from 'react';
import './App.css';
import { likePost } from './api';

function PostCard({ post, onLike }) {
  return (
    <article className="post-card" aria-label={`Post by ${post.user.name}`}>
      <div className="post-card-inner">
        <header className="post-card-header">
          <img className="post-card-avatar" src={post.user.avatar} alt={`${post.user.name} avatar`} />
          <div className="post-card-header-info">
            <div className="post-card-user">{post.user.name}</div>
            <div className="post-card-meta">{post.category} • {new Date(post.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          </div>
        </header>
        <div className="post-card-content">{post.content}</div>
      </div>
      {post.media && (
        <div className="post-card-media">
          <img src={post.media} alt="Post media" style={{ maxWidth: '100%', display: 'block' }} />
        </div>
      )}
      <div className="post-card-stats">
        <span className="post-stats-item">{post.likes} reactions</span>
        <span className="post-stats-item">{post.comments} comments</span>
      </div>
      <footer className="post-card-footer">
        <button
          className={`post-card-action-btn${post.liked ? ' active' : ''}`}
          aria-label={post.liked ? 'Unlike post' : 'Like post'}
          onClick={onLike}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 14c-.2 0-.4-.1-.5-.2L1.3 7.6c-1.7-1.7-1.7-4.5 0-6.2.8-.8 1.9-1.3 3.1-1.3 1.2 0 2.3.5 3.1 1.3l.5.5.5-.5c.8-.8 1.9-1.3 3.1-1.3 1.2 0 2.3.5 3.1 1.3 1.7 1.7 1.7 4.5 0 6.2l-6.2 6.2c-.1.1-.3.2-.5.2z"/>
          </svg>
          Like
        </button>
        <button
          className="post-card-action-btn"
          aria-label="Comment on post"
          onClick={e => {
            e.preventDefault();
            window.open('/comment-mfe?postId=' + post.id, '_blank');
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M14 1H2c-.6 0-1 .4-1 1v9c0 .6.4 1 1 1h2v3l4-3h6c.6 0 1-.4 1-1V2c0-.6-.4-1-1-1z"/>
          </svg>
          Comment
        </button>
        <button className="post-card-action-btn" aria-label="Share post">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M12 8V1H4v7H1l7 7 7-7h-3z"/>
          </svg>
          Share
        </button>
      </footer>
    </article>
  );
}

export default function PostList({ posts, setPosts }) {
  async function handleLike(idx) {
    const post = posts[idx];
    const updated = await likePost(post.id);
    setPosts(posts => posts.map((p, i) => (i === idx ? updated : p)));
  }

  return (
    <section className="post-list" aria-label="Posts feed">
      {posts.map((post, idx) => (
        <PostCard key={post.id} post={post} onLike={() => handleLike(idx)} />
      ))}
    </section>
  );
}
