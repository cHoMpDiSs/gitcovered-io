import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Theme, Flex, Text, Box, Container, Avatar, Button } from '@radix-ui/themes';
import { getUserProfile, logout } from '../services/api';
import '@radix-ui/themes/styles.css';

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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!profile) {
    return (
      <Theme>
        <Flex justify="center" align="center" style={{ height: '100vh' }}>
          <Text size="5">Loading...</Text>
        </Flex>
      </Theme>
    );
  }

  return (
    <Theme appearance="light" accentColor="blue" radius="medium">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Box className="bg-white border-b border-gray-200">
          <Container size="4">
            <Flex justify="between" align="center" py="4">
              <Text size="6" weight="bold" className="text-blue-600">
                GetCovered.io
              </Text>
              <Flex gap="4" align="center">
                <Flex gap="2" align="center">
                  <Avatar
                    size="4"
                    src={profile.avatar_img}
                    fallback={profile.full_name[0]}
                    radius="full"
                    className="border-2 border-gray-200"
                  />
                  <Box>
                    <Text size="2" weight="bold">
                      {profile.full_name}
                    </Text>
                    <Text size="1" color="gray">
                      {profile.email}
                    </Text>
                  </Box>
                </Flex>
                <Button
                  variant="soft"
                  color="gray"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Flex>
            </Flex>
          </Container>
        </Box>

        {/* Main Content */}
        <Container size="4" className="py-8">
          <Flex direction="column" gap="6">
            {/* Welcome Section */}
            <Box className="bg-white p-6 rounded-lg shadow-sm">
              <Flex direction="column" gap="2">
                <Text size="8" weight="bold">
                  {isAdmin ? 'Admin Dashboard' : 'Welcome Back'}
                </Text>
                <Text size="3" color="gray">
                  {isAdmin 
                    ? 'Manage your organization and users from here.'
                    : 'View and manage your coverage details below.'}
                </Text>
              </Flex>
            </Box>

            {/* Stats Grid */}
            <Flex gap="4" wrap="wrap">
              {[
                { label: 'Active Policies', value: '3' },
                { label: 'Claims Filed', value: '1' },
                { label: 'Coverage Amount', value: '$500,000' },
                { label: 'Next Payment', value: 'Aug 15' }
              ].map((stat, index) => (
                <Box
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm flex-1 min-w-[200px]"
                >
                  <Text size="2" color="gray">
                    {stat.label}
                  </Text>
                  <Text size="6" weight="bold">
                    {stat.value}
                  </Text>
                </Box>
              ))}
            </Flex>

            {/* Recent Activity */}
            <Box className="bg-white p-6 rounded-lg shadow-sm">
              <Text size="5" weight="bold" mb="4">
                Recent Activity
              </Text>
              <Flex direction="column" gap="3">
                {[
                  { action: 'Policy Renewed', date: '2 days ago' },
                  { action: 'Claim Processed', date: '1 week ago' },
                  { action: 'Payment Received', date: '2 weeks ago' }
                ].map((activity, index) => (
                  <Flex
                    key={index}
                    justify="between"
                    align="center"
                    className="py-2 border-b border-gray-100 last:border-0"
                  >
                    <Text size="2">{activity.action}</Text>
                    <Text size="1" color="gray">
                      {activity.date}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Box>

            {/* Admin Only Section */}
            {isAdmin && (
              <Box className="bg-white p-6 rounded-lg shadow-sm">
                <Text size="5" weight="bold" mb="4">
                  Administrative Controls
                </Text>
                <Flex gap="4" wrap="wrap">
                  <Button variant="soft">Manage Users</Button>
                  <Button variant="soft">View Reports</Button>
                  <Button variant="soft">System Settings</Button>
                </Flex>
              </Box>
            )}
          </Flex>
        </Container>
      </div>
    </Theme>
  );
};

export default Dashboard;