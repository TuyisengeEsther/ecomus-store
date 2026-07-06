import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.user || response.data?.user || response.data);
    } catch (err) {
      setError("Failed to load profile. Please login again.");
    }
  };

  if (error) return <p className="text-red-600 text-center">{error}</p>;
  if (!user) return <p className="text-center">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p>
        <strong>Created:</strong>{" "}
        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
      </p>
    </div>
  );
}

export default Profile;