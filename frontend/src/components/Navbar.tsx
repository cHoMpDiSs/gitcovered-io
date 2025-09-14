import React from 'react';
import { Flex, Button, Box, Avatar, DropdownMenu, Text } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, profile, isAdmin, signOut } = useAuth();

  return (
    <Box className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto">
        <Flex
          justify="between"
          align="center"
          px="6"
          py="4"
        >
          <div
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-blue-600 cursor-pointer ml-4 tracking-tight hover:text-blue-700 transition-colors"
          >
            GetCovered.io
          </div>

          <Flex gap="4" className="mr-4">
            {isAuthenticated && profile ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <button className="flex items-center">
                    <Avatar
                      size="3"
                      src={profile.avatar_img || undefined}
                      fallback={profile.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
                      radius="full"
                      className="border-2 border-gray-200"
                    />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                  {isAdmin && (
                    <DropdownMenu.Item onSelect={() => navigate('/admin/dashboard')}>
                      <Text size="2">Admin dashboard</Text>
                    </DropdownMenu.Item>
                  )}
                  <DropdownMenu.Item onSelect={() => navigate('/dashboard')}>
                    <Text size="2">My dashboard</Text>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item color="red" onSelect={() => { signOut(); navigate('/signin'); }}>
                    <Text size="2">Sign out</Text>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            ) : (
              <>
                <Button
                  variant="soft"
                  onClick={() => navigate('/login')}
                  className="bg-gray-100 hover:bg-gray-200 px-4"
                >
                  Sign In
                </Button>
                <div className="hidden md:block">
                  <Button
                    onClick={() => navigate('/signup')}
                    className="bg-blue-600 hover:bg-blue-700 px-4"
                  >
                    Get Started
                  </Button>
                </div>
              </>
            )}
          </Flex>
        </Flex>
      </div>
    </Box>
  );
};

export default Navbar;