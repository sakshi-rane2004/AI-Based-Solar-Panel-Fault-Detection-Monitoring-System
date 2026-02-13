import React from 'react';

const Profile = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Profile</h1>
        <p>User profile and settings</p>
      </div>
      
      <div className="content-grid">
        <div className="card">
          <div className="card-header">
            <h2>User Information</h2>
          </div>
          <div className="card-content">
            <p>Profile functionality has been disabled. This is now an open-access system.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;