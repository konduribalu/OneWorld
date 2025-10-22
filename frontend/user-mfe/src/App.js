import React from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import UserCard from './components/UserCard';
import UserAvatar from './components/UserAvatar';
import UserIcon from './components/UserIcon';

/**
 * User MFE - No internal routing
 * All components are exported for the shell to mount independently
 * Shell handles navigation and authentication flow
 */

function App() {
  return (
    <div className="user-mfe-app">
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>User MFE</h2>
        <p>This microfrontend provides user authentication and profile components.</p>
        <p>Components are mounted by the shell application.</p>
      </div>
    </div>
  );
}

// Export all components for shell to use
export { Login, Register, Profile, UserCard, UserAvatar, UserIcon };
export default App;

