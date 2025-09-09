import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/api';

interface DashboardProps {
  isAdmin?: boolean;
}

interface UserProfile {
  full_name: string;
  email: string;
  avatar_img: string;
}

const Dashboard: React.FC<DashboardProps> = ({ isAdmin = false }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
          </h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <img
              src={profile.avatar_img}
              alt={profile.full_name}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <h2 className="text-xl font-medium text-gray-900">{profile.full_name}</h2>
              <p className="text-gray-500">{profile.email}</p>
              {isAdmin && <p className="text-green-600 font-medium">Admin Access</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;