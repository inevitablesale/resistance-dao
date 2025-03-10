
import React from 'react';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { profileId } = useParams();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <p className="mb-4">Profile ID: {profileId}</p>
    </div>
  );
};

export default ProfilePage;
