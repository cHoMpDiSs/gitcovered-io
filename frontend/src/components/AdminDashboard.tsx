import React from 'react';
import { Theme, Flex, Text, Box, Table, Avatar, Tabs, Button } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { logout, getAdminProfile, checkAuthStatus } from '../services/api';
import Settings from './Settings';

interface User {
  id: number;
  full_name: string;
  email: string;
  avatar_img: string;
  is_admin: boolean;
  created_at: string;
  last_login: string | null;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState<{ full_name: string; avatar_img: string | null }>({
    full_name: '',
    avatar_img: null
  });

  const fetchProfile = React.useCallback(async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const data = await getAdminProfile();
      
      // Handle backend redirects
      if (data.redirect) {
        navigate(data.redirect);
        return;
      }

      setProfile({
        full_name: data.full_name,
        avatar_img: data.avatar_img
      });
    } catch (error) {
      console.error('Error in admin dashboard:', error);
      localStorage.removeItem('jwt_token');
      navigate('/login');
    }
  }, [navigate]);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  // Hardcoded users data
  const users: User[] = [
    {
    
      id: 3,
      full_name: 'John Smith',
      email: 'john.smith@example.com',
      avatar_img: 'https://ui-avatars.com/api/?name=John+Smith',
      is_admin: false,
      created_at: '2025-08-15T10:30:00Z',
      last_login: '2025-09-08T15:45:00Z'
    },
    {
      id: 4,
      full_name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      avatar_img: 'https://ui-avatars.com/api/?name=Sarah+Johnson',
      is_admin: false,
      created_at: '2025-08-20T14:20:00Z',
      last_login: '2025-09-07T09:15:00Z'
    },
    {
      id: 5,
      full_name: 'Michael Chen',
      email: 'mchen@example.com',
      avatar_img: 'https://ui-avatars.com/api/?name=Michael+Chen',
      is_admin: false,
      created_at: '2025-08-25T11:10:00Z',
      last_login: null
    },
    {
      id: 6,
      full_name: 'Emily Brown',
      email: 'emily.brown@example.com',
      avatar_img: 'https://ui-avatars.com/api/?name=Emily+Brown',
      is_admin: false,
      created_at: '2025-08-28T16:45:00Z',
      last_login: '2025-09-09T10:20:00Z'
    },
    {
      id: 7,
      full_name: 'David Wilson',
      email: 'david.w@example.com',
      avatar_img: 'https://ui-avatars.com/api/?name=David+Wilson',
      is_admin: false,
      created_at: '2025-09-01T09:00:00Z',
      last_login: '2025-09-08T16:20:00Z'
    },
    {
      id: 8,
      full_name: 'Lisa Anderson',
      email: 'lisa.a@example.com',
      avatar_img: 'https://ui-avatars.com/api/?name=Lisa+Anderson',
      is_admin: false,
      created_at: '2025-09-03T13:15:00Z',
      last_login: '2025-09-09T10:45:00Z'
    },
    {
      id: 9,
      full_name: 'James Taylor',
      email: 'jtaylor@example.com',
      avatar_img: 'https://ui-avatars.com/api/?name=James+Taylor',
      is_admin: false,
      created_at: '2025-09-05T15:30:00Z',
      last_login: '2025-09-09T08:30:00Z'
    },
    {
      id: 10,
      full_name: 'Rachel Martinez',
      email: 'rachel.m@example.com',
      avatar_img: 'https://ui-avatars.com/api/?name=Rachel+Martinez',
      is_admin: false,
      created_at: '2025-09-07T08:45:00Z',
      last_login: '2025-09-09T11:15:00Z'
    }
  ];

  return (
    <Theme>
      <Box className="p-8">
        <Flex direction="column" gap="6">
          {/* Greeting Section */}
          <Box className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
            <Flex className="flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Flex align="center" gap="4">
                <Avatar
                  size="6"
                  src={profile.avatar_img || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}`}
                  fallback={profile.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
                  radius="full"
                  className="border-2 border-blue-200"
                />
                <Text size="6" weight="bold" className="text-blue-600 md:text-[2.5rem]">
                  {(() => {
                    const first = (profile.full_name || '').trim().split(' ')[0] || 'there';
                    return `Welcome, ${first.charAt(0).toUpperCase()}${first.slice(1)}!`;
                  })()}
                </Text>
              </Flex>
              {/* Logout moved to Settings */}
            </Flex>
          </Box>

          {/* Tabs */}
          <Tabs.Root defaultValue="settings">
            <Tabs.List>
              <Tabs.Trigger value="users">Users</Tabs.Trigger>
              <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
            </Tabs.List>

            <Box className="mt-6">
              <Tabs.Content value="users">
                {/* User List */}
                <Box className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Desktop View */}
                  <div className="hidden md:block">
                    <Table.Root>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Last Login</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>

                      <Table.Body>
                        {users.map((user) => (
                          <Table.Row key={user.id}>
                            <Table.Cell>
                              <Flex align="center" gap="3">
                                <Avatar
                                  size="2"
                                  src={user.avatar_img}
                                  fallback={user.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
                                  radius="full"
                                />
                                <Text>{user.full_name}</Text>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell>
                              <Text>{user.email}</Text>
                            </Table.Cell>
                            <Table.Cell>
                              <Text color={user.is_admin ? "blue" : "gray"}>
                                {user.is_admin ? 'Admin' : 'User'}
                              </Text>
                            </Table.Cell>
                            <Table.Cell>
                              <Text color="gray">
                                {new Date(user.created_at).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Text>
                            </Table.Cell>
                            <Table.Cell>
                              <Text color="gray">
                                {user.last_login ? new Date(user.last_login).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'Never'}
                              </Text>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </div>

                  {/* Mobile View */}
                  <div className="block md:hidden">
                    <div className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <div key={user.id} className="p-4">
                          <Flex direction="column" gap="3">
                            <Flex align="center" gap="3">
                              <Avatar
                                size="3"
                                src={user.avatar_img}
                                fallback={user.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
                                radius="full"
                              />
                              <div>
                                <Text weight="bold">{user.full_name}</Text>
                                <Text size="2" color="gray">{user.email}</Text>
                              </div>
                            </Flex>
                            <Flex gap="2" align="center">
                              <Text size="2" color={user.is_admin ? "blue" : "gray"}>
                                {user.is_admin ? 'Admin' : 'User'}
                              </Text>
                              <Text size="2" color="gray">•</Text>
                              <Text size="2" color="gray">
                                Joined {new Date(user.created_at).toLocaleDateString()}
                              </Text>
                            </Flex>
                            <Text size="2" color="gray">
                              Last login: {user.last_login 
                                ? new Date(user.last_login).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                : 'Never'}
                            </Text>
                          </Flex>
                        </div>
                      ))}
                    </div>
                  </div>
                </Box>
              </Tabs.Content>

              <Tabs.Content value="settings">
                <Settings onProfileUpdate={() => fetchProfile()} />
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </Flex>
      </Box>
    </Theme>
  );
};

export default AdminDashboard;