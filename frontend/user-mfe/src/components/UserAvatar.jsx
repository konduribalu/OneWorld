import React, { useEffect, useState } from 'react';
import './UserAvatar.css';

export default function UserAvatar({ user: propUser, onClick }) {
  const [user, setUser] = useState(propUser);

  useEffect(() => {
    if (!propUser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse stored user', e);
        }
      }
    } else {
      setUser(propUser);
    }
  }, [propUser]);

  if (!user) {
    return (
      <div className="user-avatar-card" onClick={onClick}>
        <div className="avatar-placeholder">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="#ccc">
            <circle cx="30" cy="30" r="30"/>
            <circle cx="30" cy="22" r="10" fill="white"/>
            <path d="M10 50c0-11 9-20 20-20s20 9 20 20" fill="white"/>
          </svg>
        </div>
        <div className="avatar-info">
          <div className="avatar-name">Guest User</div>
          <div className="avatar-title">Please log in</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-avatar-card" onClick={onClick}>
      <div className="avatar-photo">
        <img src={user.photo || 'https://randomuser.me/api/portraits/men/32.jpg'} alt={user.name} />
      </div>
      <div className="avatar-info">
        <div className="avatar-name">{user.name}</div>
        <div className="avatar-title">{user.title || 'Professional'}</div>
        <div className="avatar-location">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0C3.9 0 2.25 1.65 2.25 3.75c0 2.93 3.75 8.25 3.75 8.25s3.75-5.32 3.75-8.25C9.75 1.65 8.1 0 6 0zm0 5.63c-1.05 0-1.88-.83-1.88-1.88S4.95 1.87 6 1.87s1.88.83 1.88 1.88S7.05 5.63 6 5.63z"/>
          </svg>
          {user.location || 'Location not set'}
        </div>
      </div>
    </div>
  );
}
