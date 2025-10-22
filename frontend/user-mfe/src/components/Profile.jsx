import React, { useState, useEffect } from 'react';
import './Profile.css';

export default function Profile({ user: propUser, onLogout }) {
  const [user, setUser] = useState(propUser);
  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // If no user prop, try to load from localStorage
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
      <div className="profile-container">
        <div className="profile-error">
          <h2>Not logged in</h2>
          <p>Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    if (onLogout) onLogout();
  };

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-cover">
          <img 
            src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop" 
            alt="Cover"
          />
        </div>
        <div className="profile-main-info">
          <div className="profile-avatar-large">
            <img src={user.photo || 'https://randomuser.me/api/portraits/men/32.jpg'} alt={user.name} />
          </div>
          <div className="profile-identity">
            <h1>{user.name}</h1>
            <p className="profile-title">{user.title || 'Professional'}</p>
            <p className="profile-location">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C5.2 0 3 2.2 3 5c0 3.9 5 11 5 11s5-7.1 5-11c0-2.8-2.2-5-5-5zm0 7.5c-1.4 0-2.5-1.1-2.5-2.5S6.6 2.5 8 2.5s2.5 1.1 2.5 2.5S9.4 7.5 8 7.5z"/>
              </svg>
              {user.location || 'Location not set'}
            </p>
            <p className="profile-connections">
              <strong>{user.connections || 500}+</strong> connections
            </p>
          </div>
          <div className="profile-actions">
            <button className="btn-secondary" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button className="btn-secondary">Add section</button>
            <button className="btn-primary">Open to</button>
            <button className="btn-icon" onClick={handleLogout} title="Logout">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 3h8v2H5v10h6v2H3V3zm12.5 4.5l3.5 3.5-3.5 3.5-1.4-1.4 1.1-1.1H9v-2h6.2l-1.1-1.1 1.4-1.4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="profile-left-column">
          {/* About Card */}
          <div className="profile-card">
            <h2>About</h2>
            <p className="profile-bio">
              {user.bio || `Passionate ${user.title || 'professional'} with expertise in building innovative solutions. Always eager to connect with like-minded professionals and explore new opportunities.`}
            </p>
          </div>

          {/* Experience Card */}
          <div className="profile-card">
            <h2>Experience</h2>
            <div className="experience-item">
              <div className="experience-logo">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="#0077B5">
                  <rect width="48" height="48" rx="4"/>
                  <text x="24" y="32" fontSize="24" fill="white" textAnchor="middle" fontWeight="bold">C</text>
                </svg>
              </div>
              <div className="experience-details">
                <h3>{user.title || 'Senior Professional'}</h3>
                <p className="experience-company">Current Company</p>
                <p className="experience-duration">Jan 2022 - Present · 2 yrs 10 mos</p>
                <p className="experience-location">{user.location || 'Remote'}</p>
              </div>
            </div>
            <div className="experience-item">
              <div className="experience-logo">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="#666">
                  <rect width="48" height="48" rx="4"/>
                  <text x="24" y="32" fontSize="24" fill="white" textAnchor="middle" fontWeight="bold">P</text>
                </svg>
              </div>
              <div className="experience-details">
                <h3>Previous Role</h3>
                <p className="experience-company">Previous Company</p>
                <p className="experience-duration">Mar 2019 - Dec 2021 · 2 yrs 10 mos</p>
                <p className="experience-location">San Francisco, CA</p>
              </div>
            </div>
          </div>

          {/* Education Card */}
          <div className="profile-card">
            <h2>Education</h2>
            <div className="education-item">
              <div className="education-logo">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="#003262">
                  <rect width="48" height="48" rx="4"/>
                  <text x="24" y="32" fontSize="20" fill="white" textAnchor="middle" fontWeight="bold">🎓</text>
                </svg>
              </div>
              <div className="education-details">
                <h3>University Name</h3>
                <p className="education-degree">Bachelor's Degree, Computer Science</p>
                <p className="education-duration">2015 - 2019</p>
              </div>
            </div>
          </div>

          {/* Skills Card */}
          <div className="profile-card">
            <h2>Skills</h2>
            <div className="skills-grid">
              <span className="skill-badge">JavaScript</span>
              <span className="skill-badge">React</span>
              <span className="skill-badge">Node.js</span>
              <span className="skill-badge">Python</span>
              <span className="skill-badge">TypeScript</span>
              <span className="skill-badge">AWS</span>
              <span className="skill-badge">Docker</span>
              <span className="skill-badge">Leadership</span>
              <span className="skill-badge">Agile</span>
            </div>
          </div>
        </div>

        <div className="profile-right-column">
          {/* Analytics Card */}
          <div className="profile-card analytics-card">
            <h3>Analytics</h3>
            <p className="analytics-subtitle">Private to you</p>
            <div className="analytics-metrics">
              <div className="metric">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <div>
                  <strong>348</strong>
                  <p>Profile views</p>
                </div>
              </div>
              <div className="metric">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                <div>
                  <strong>89</strong>
                  <p>Post impressions</p>
                </div>
              </div>
              <div className="metric">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                <div>
                  <strong>52</strong>
                  <p>Search appearances</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resources Card */}
          <div className="profile-card">
            <h3>Resources</h3>
            <div className="resource-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 13H9v-2h2v2zm0-4H9V5h2v6z"/>
              </svg>
              <span>Creator mode: Off</span>
            </div>
            <div className="resource-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/>
              </svg>
              <span>My network</span>
            </div>
          </div>

          {/* Featured Card */}
          <div className="profile-card">
            <h3>Featured</h3>
            <div className="featured-item">
              <div className="featured-thumbnail">
                <svg width="100%" height="100%" viewBox="0 0 200 120" fill="#f0f0f0">
                  <rect width="200" height="120"/>
                  <text x="50%" y="50%" fontSize="14" fill="#999" textAnchor="middle" dominantBaseline="middle">Article</text>
                </svg>
              </div>
              <p className="featured-title">My latest thoughts on technology</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
