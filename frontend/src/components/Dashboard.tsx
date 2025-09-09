import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { Theme, Flex, Text, Box, Container, Avatar, Button, Tabs } from '@radix-ui/themes';
import { getUserProfile, logout, checkAuthStatus } from '../services/api';
import Settings from './Settings';
import '@radix-ui/themes/styles.css';

interface UserProfile {
  full_name: string;
  email: string;
  avatar_img: string;
}

const Dashboard = (): JSX.Element => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const verifyAndFetchProfile = useCallback(async () => {
    try {
      // First check if token exists
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        console.error('No token found');
        navigate('/login');
        return;
      }

      // Check authentication status
      const auth = await checkAuthStatus();
      if (!auth.authenticated) {
        console.error('User is not authenticated');
        localStorage.removeItem('jwt_token');
        navigate('/login');
        return;
      }

      // If user is admin, redirect to admin dashboard
      if (auth.is_admin) {
        console.log('User is admin, redirecting to admin dashboard');
        navigate('/admin/dashboard');
        return;
      }

      // If user is authenticated and not admin, fetch profile
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error in dashboard:', error);
      localStorage.removeItem('jwt_token');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    verifyAndFetchProfile();
  }, [verifyAndFetchProfile]);

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
              <div
                onClick={() => navigate('/')}
                className="text-2xl font-bold text-blue-600 cursor-pointer ml-4 tracking-tight hover:text-blue-700 transition-colors"
              >
                GetCovered.io
              </div>
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
                  </Box>
                </Flex>
                <Button
                  variant="soft"
                  color="gray"
                  onClick={handleLogout}
                  className="mr-4"
                >
                  Logout
                </Button>
              </Flex>
            </Flex>
          </Container>
        </Box>

        {/* Main Content */}
        <Container size="4" className="py-8">
          <Tabs.Root defaultValue="overview">
            <Tabs.List>
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
            </Tabs.List>

            <Box className="mt-6">
              <Tabs.Content value="overview">
                <Flex direction="column" gap="6">
                  {/* Welcome Section */}
            <Box className="bg-white p-8 rounded-lg shadow-sm">
              <Flex direction="column" gap="3">
                <Text size="8" weight="bold" className="break-words">
                  Welcome Back
                </Text>
                <Text size="3" color="gray" className="break-words max-w-2xl">
                  View and manage your coverage details below.
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
                  className="bg-white p-6 rounded-lg shadow-sm flex-1 min-w-[240px] flex flex-col gap-3"
                >
                  <Text size="2" color="gray" className="break-words">
                    {stat.label}
                  </Text>
                  <Text size="6" weight="bold" className="break-words">
                    {stat.value}
                  </Text>
                </Box>
              ))}
            </Flex>

            {/* Recent Activity */}
            <Box className="bg-white p-8 rounded-lg shadow-sm">
              <Text size="5" weight="bold" mb="6">
                Recent Activity
              </Text>
              <Flex direction="column" gap="4">
                {[
                  { action: 'Policy Renewed', date: '2 days ago' },
                  { action: 'Claim Processed', date: '1 week ago' },
                  { action: 'Payment Received', date: '2 weeks ago' }
                ].map((activity, index) => (
                  <Flex
                    key={index}
                    justify="between"
                    align="center"
                    className="py-3 border-b border-gray-100 last:border-0"
                  >
                    <Text size="2" className="break-words flex-1 mr-4">
                      {activity.action}
                    </Text>
                    <Text size="2" color="gray" className="whitespace-nowrap">
                      {activity.date}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Box>

          </Flex>
              </Tabs.Content>
              <Tabs.Content value="settings">
                <Settings onProfileUpdate={() => verifyAndFetchProfile()} />
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </Container>
      </div>
    </Theme>
  );
};

export default Dashboard;