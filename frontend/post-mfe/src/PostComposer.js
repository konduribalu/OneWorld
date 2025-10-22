import React, { useState } from 'react';
import './App.css';

const categories = [
  'Movies', 'Tech', 'Science', 'Jobs', 'Lifestyle', 'Health', 'Art'
];

export default function PostComposer({ onSubmit }) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [moderationStatus, setModerationStatus] = useState('');

  function handleMediaChange(e) {
    const file = e.target.files[0];
    setMedia(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setMediaPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(null);
    }
  }

  async function fakeModerationAPI(text) {
    // Simulate AI moderation: reject if text contains 'spam' or 'abuse'
    await new Promise(res => setTimeout(res, 800));
    if (/spam|abuse|adult/i.test(text)) return 'Rejected: Unsafe content';
    return 'Approved';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setModerationStatus('Checking...');
    const result = await fakeModerationAPI(content);
    setModerationStatus(result);
    if (result === 'Approved' && onSubmit) {
      onSubmit({ content, category, media });
      setContent('');
      setMedia(null);
      setMediaPreview(null);
    }
  }

  return (
    <section className="post-composer">
      <form className="composer-form" aria-label="Create a post" onSubmit={handleSubmit}>
        <div className="composer-header">
          <img className="composer-avatar" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar" />
          <div className="composer-input-wrapper">
            <textarea
              className="composer-input"
              placeholder="What's on your mind?"
              rows={3}
              aria-label="Post content"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
            <div className="composer-footer">
              <div className="composer-controls">
                <input
                  type="file"
                  accept="image/*"
                  id="photo-upload"
                  className="composer-media-input"
                  onChange={handleMediaChange}
                  aria-label="Attach photo"
                  style={{ display: 'none' }}
                />
                <label htmlFor="photo-upload" className="composer-media-btn photo-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                    <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </label>
                
                <input
                  type="file"
                  accept="video/*"
                  id="video-upload"
                  className="composer-media-input"
                  onChange={handleMediaChange}
                  aria-label="Attach video"
                  style={{ display: 'none' }}
                />
                <label htmlFor="video-upload" className="composer-media-btn video-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </label>
              </div>
              <button type="submit" className="composer-send-btn" aria-label="Send post">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        {mediaPreview && (
          <div className="composer-media-preview">
            <img src={mediaPreview} alt="Media preview" style={{ maxWidth: '100%', maxHeight: 200 }} />
          </div>
        )}
        {moderationStatus && (
          <div className="moderation-status" aria-live="polite">{moderationStatus}</div>
        )}
      </form>
    </section>
  );
}
