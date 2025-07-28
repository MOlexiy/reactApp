import React from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUser } from "../../../api/authApi.js";
import { ProfileForm } from "./ProfileForm.jsx";

export const ProfileFormWrapper = () => {
  const [initialData, setInitialData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect( () => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
        const profileData = await getUserProfile(token);
        setInitialData(profileData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const handleFormSubmit = async (updatedData) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      await updateUser(initialData.id, updatedData, token);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  }

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!initialData) {
    return <div className="text-center">No user profile found.</div>;
  }

  return (
    <div className="profile-form-wrapper p-4">
      <ProfileForm
        initialData={initialData}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}