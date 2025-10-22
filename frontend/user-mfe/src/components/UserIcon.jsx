import React, { useEffect, useState } from 'react';
import './UserIcon.css';

export default function UserIcon({ user: propUser, onClick }) {
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
      <div className="user-icon-container" onClick={onClick}>
        <div className="user-icon-avatar">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="#999">
            <circle cx="16" cy="16" r="16"/>
            <circle cx="16" cy="12" r="5" fill="white"/>
            <path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" fill="white"/>
          </svg>
        </div>
        <div className="user-icon-info">
          <span className="user-icon-name">Guest</span>
        </div>
      </div>
    );
  }

  return (
    <div className="user-icon-container" onClick={onClick}>
      <div className="user-icon-avatar">
        <img src={user.photo || 'https://randomuser.me/api/portraits/men/32.jpg'} alt={user.name} />
      </div>
      <div className="user-icon-info">
        <span className="user-icon-name">{user.name}</span>
        <svg className="user-icon-dropdown" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 8L2 4h8L6 8z"/>
        </svg>
      </div>
    </div>
  );
}
