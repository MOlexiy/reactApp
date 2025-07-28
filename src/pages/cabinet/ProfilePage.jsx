import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from "../../api/authApi.js";

export const ProfilePage = () => {
  const [userProfile, setUserProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect( () => {
     const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const profileData = await getUserProfile(token);
        console.log('Profile Data:', profileData);
        setUserProfile(profileData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
     }
     fetchUserProfile();
  }, [navigate]);

  const handleEditClick = () => {
    navigate('/profile/edit');
  }

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!userProfile) {
    return <div className="text-center">No user profile found.</div>;
  }

  return (
    <div className="profile-page-container p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="profile-details bg-white shadow-md rounded-lg p-6">
        <p><strong>Username:</strong> {userProfile.userName}</p>
        <p><strong>Email:</strong> {userProfile.email}</p>
        <p><strong>Full Name:</strong> {userProfile.fullName}</p>
        <p><strong>Company:</strong> {userProfile.company}</p>
        <p><strong>Roles:</strong> {userProfile.roles ? userProfile.roles.join(', ') : 'None'}</p>
        <button
          onClick={handleEditClick}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};