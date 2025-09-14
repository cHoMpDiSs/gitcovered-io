import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Theme, Flex, Text, Box, Container, Tabs } from '@radix-ui/themes';
import { getUserProfile } from '../services/api';
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

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const data = await getUserProfile();
      
      // Handle backend redirects
      if (data.redirect) {
        navigate(data.redirect);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in dashboard:', error);
      localStorage.removeItem('jwt_token');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!profile) {
    return (
      <Theme>
        <Flex justify="center" align="center" style={{ height: '100vh' }}>
          <div
            className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
            aria-label="Loading"
          />
        </Flex>
      </Theme>
    );
  }

  return (
    <Theme appearance="light" accentColor="blue" radius="medium">
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <Container size="4" className="py-8">
          {/* Persistent Welcome Section above tabs */}
          <Box className="bg-white p-8 rounded-lg shadow-sm mb-6">
            <Flex direction="column" gap="3">
              <Text size="8" weight="bold" className="break-words">
                {(() => {
                  const first = (profile.full_name || '').trim().split(' ')[0] || 'there';
                  const formatted = first ? first.charAt(0).toUpperCase() + first.slice(1) : 'there';
                  return `Welcome ${formatted}!`;
                })()}
              </Text>
              <Text size="3" color="gray" className="break-words max-w-2xl">
                View and manage your coverage details below.
              </Text>
            </Flex>
          </Box>

          <Tabs.Root defaultValue="settings">
            <Tabs.List>
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
            </Tabs.List>

            <Box className="mt-6">
              <Tabs.Content value="overview">
                <Flex direction="column" gap="6">
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
                <Settings onProfileUpdate={() => fetchProfile()} />
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </Container>
      </div>
    </Theme>
  );
};

export default Dashboard;