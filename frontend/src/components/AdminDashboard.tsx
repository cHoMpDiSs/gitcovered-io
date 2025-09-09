import React, { useEffect, useState } from 'react';
import { Theme, Flex, Text, Box, Table, Avatar } from '@radix-ui/themes';
import { getAdminUsers } from '../services/api';
import toast from 'react-hot-toast';

interface User {
  id: number;
  full_name: string;
  email: string;
  avatar_img: string;
  is_admin: boolean;
  created_at: string;
  last_login: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAdminUsers();
        setUsers(data.users);
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <Theme>
        <Box className="p-8">
          <Text>Loading users...</Text>
        </Box>
      </Theme>
    );
  }

  return (
    <Theme>
      <Box className="p-8">
        <Flex direction="column" gap="6">
          <Flex justify="between" align="center">
            <Text size="8" weight="bold">User Management</Text>
            <Text size="3" color="gray">Total Users: {users.length}</Text>
          </Flex>

          <Box className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                          fallback={user.full_name[0]}
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
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text color="gray">
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Flex>
      </Box>
    </Theme>
  );
};

export default AdminDashboard;