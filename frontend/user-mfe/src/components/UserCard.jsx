import React, { useState } from 'react';
import mockApi from '../api/mockUserApi';

export default function UserCard({ user, onFollowChange, currentUser }) {
  const [loading, setLoading] = useState(false);

  const isFollowing = currentUser?.following?.includes(user.id);

  async function toggleFollow() {
    setLoading(true);
    try {
      if (isFollowing) await mockApi.unfollow(currentUser.id, user.id);
      else await mockApi.follow(currentUser.id, user.id);
      onFollowChange && onFollowChange(user.id);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
      <div><strong>{user.name}</strong></div>
      <div>{user.email}</div>
      <button onClick={toggleFollow} disabled={loading}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
    </div>
  );
}
