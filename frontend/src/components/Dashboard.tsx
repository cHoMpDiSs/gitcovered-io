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
      <div className="min-h-screen bg-gray-50 relative">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 10%, rgba(59,130,246,0.06), transparent 35%), radial-gradient(circle at 80% 90%, rgba(6,182,212,0.06), transparent 35%)' }} />
          <div className="absolute inset-0 pointer-events-none opacity-[0.3]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        </div>

        {/* Main Content */}
        <Container size="4" className="py-8 px-2 sm:px-0">
          {/* Persistent Welcome Section above tabs */}
          <Box className="relative overflow-hidden rounded-2xl mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 opacity-95" />
            <div className="relative p-8">
              <Flex direction="column" gap="2">
                <Text size="8" weight="bold" className="text-white break-words">
                  {(() => {
                    const first = (profile.full_name || '').trim().split(' ')[0] || 'there';
                    const formatted = first ? first.charAt(0).toUpperCase() + first.slice(1) : 'there';
                    return `Welcome ${formatted}!`;
                  })()}
                </Text>
                <Text size="3" className="text-blue-50 break-words max-w-2xl">
                  View and manage your coverage details below.
                </Text>
              </Flex>
            </div>
          </Box>

          <Tabs.Root defaultValue="overview">
            <Tabs.List>
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
            </Tabs.List>

            <Box className="mt-6">
              <Tabs.Content value="overview">
                <Flex direction="column" gap="6">
            {/* Stats Grid */}
            <Flex gap="4" wrap="wrap" className="opacity-0 translate-y-2 animate-[fadeInUp_600ms_ease-out_forwards]">
              {[
                { label: 'Active Policies', value: '3', trend: '+1 this month', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M3 3.75A.75.75 0 0 1 3.75 3h16.5a.75.75 0 0 1 .75.75V9a.75.75 0 0 1-1.5 0V4.5H4.5V19.5H9a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 20.25V3.75Z" />
                    <path d="M15.53 8.47a.75.75 0 0 1 1.06 0l3.22 3.22a.75.75 0 0 1 0 1.06l-5.907 5.907a2.25 2.25 0 0 1-1.591.659H9.75a.75.75 0 0 1-.75-.75v-2.561c0-.596.237-1.168.659-1.591L15.53 8.47Z" />
                  </svg>
                ) },
                { label: 'Claims Filed', value: '1', trend: '0 this week', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M6.75 4.5A2.25 2.25 0 0 0 4.5 6.75v10.5A2.25 2.25 0 0 0 6.75 19.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 17.25 4.5H6.75Zm2.25 3A.75.75 0 0 1 9.75 6h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 7.5Zm0 3A.75.75 0 0 1 9.75 9h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 10.5Zm0 3a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H9.75A.75.75 0 0 1 9 13.5Z" clipRule="evenodd" />
                  </svg>
                ) },
                { label: 'Coverage Amount', value: '$500,000', trend: '+$10k YoY', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M11.25 5.25a.75.75 0 0 1 .75-.75h.75a3.75 3.75 0 1 1 0 7.5H12a.75.75 0 0 0 0 1.5h.75a5.25 5.25 0 1 0 0-10.5H12a.75.75 0 0 1-.75-.75Z" />
                    <path d="M9 7.5A2.25 2.25 0 1 0 9 12h1.5a.75.75 0 0 1 0 1.5H9A3.75 3.75 0 1 1 9 4.5h.75a.75.75 0 0 1 0 1.5H9Z" />
                  </svg>
                ) },
                { label: 'Next Payment', value: 'Aug 15', trend: 'in 5 days', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M6.75 2.25a.75.75 0 0 1 .75.75V4.5h9V3a.75.75 0 0 1 1.5 0V4.5h.75A2.25 2.25 0 0 1 21 6.75v10.5A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25V6.75A2.25 2.25 0 0 1 5.25 4.5H6V3a.75.75 0 0 1 .75-.75ZM4.5 9A.75.75 0 0 1 5.25 8.25h13.5a.75.75 0 0 1 0 1.5H5.25A.75.75 0 0 1 4.5 9Z" clipRule="evenodd" />
                  </svg>
                ) }
              ].map((stat, index) => (
                <div key={index} className="relative rounded-2xl p-[1px] bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 flex-1 min-w-[240px]">
                  <Box className="bg-white rounded-2xl p-6 h-full flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 flex items-center justify-center shadow-inner">
                        {stat.icon}
                      </div>
                      <div className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.trend}</div>
                    </div>
                    <Text size="2" color="gray" className="break-words">
                      {stat.label}
                    </Text>
                    <Text size="6" weight="bold" className="break-words">
                      {stat.value}
                    </Text>
                    <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
                    </div>
                  </Box>
                </div>
              ))}
            </Flex>

            {/* Overview Graph */}
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 opacity-0 translate-y-2 animate-[fadeInUp_700ms_ease-out_forwards]">
              <Box className="bg-white rounded-2xl p-6">
                <Text size="5" weight="bold">Coverage Activity</Text>
                <div className="mt-4 h-36 flex items-end gap-2">
                  {[18, 26, 14, 32, 22, 28, 35, 30, 24, 38, 28, 34].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-md" style={{ height: `${h * 2}px` }} />
                  ))}
                </div>
              </Box>
            </div>

            {/* Recent Activity */}
            <Box className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 opacity-0 translate-y-2 animate-[fadeInUp_800ms_ease-out_forwards]">
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