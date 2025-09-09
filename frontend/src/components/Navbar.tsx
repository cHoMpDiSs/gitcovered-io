import React from 'react';
import { Flex, Button, Box } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

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
            SoberFriend.io
          </div>

          <Flex gap="4" className="mr-4">
            <Button
              variant="soft"
              onClick={() => navigate('/login')}
              className="bg-gray-100 hover:bg-gray-200 px-4"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700 px-4"
            >
              Get Started
            </Button>
          </Flex>
        </Flex>
      </div>
    </Box>
  );
};

export default Navbar;