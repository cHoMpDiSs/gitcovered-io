import React from 'react';
import { Theme, Flex, Text, Button, Box } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '../services/api';
import '@radix-ui/themes/styles.css';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Theme appearance="light" accentColor="blue" radius="medium">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        {/* Card Container - 1/3 width on medium+ screens */}
        <div className="w-full md:w-1/3 min-w-[320px] max-w-md">
          <Box className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Card Header */}
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <div 
                onClick={() => navigate('/')}
                className="text-xl sm:text-2xl font-bold text-blue-600 cursor-pointer text-center"
              >
                GetCovered.io
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 sm:p-8">
              <Flex direction="column" gap="4">
                {/* Title Section */}
                <Flex direction="column" align="center" gap="2" className="mb-2">
                  <Text 
                    size="5" 
                    weight="bold" 
                    align="center"
                    className="text-lg sm:text-xl"
                  >
                    Create your account
                  </Text>
                  <Text 
                    size="2" 
                    color="gray" 
                    align="center"
                    className="text-sm"
                  >
                    Get started with GetCovered.io
                  </Text>
                </Flex>

                {/* Google Sign Up Button */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <button
                    onClick={loginWithGoogle}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <Text size="2" weight="medium" className="text-sm sm:text-base">
                      Sign up with Google
                    </Text>
                  </button>
                </div>

                {/* Benefits List */}
                <div className="bg-gray-50 p-4 rounded-lg mt-2">
                  <Text size="2" weight="medium" className="mb-3 text-sm sm:text-base">
                    What you'll get:
                  </Text>
                  <Flex direction="column" gap="2">
                    {[
                      'Personalized coverage dashboard',
                      'Real-time policy updates',
                      'Secure document storage',
                      '24/7 customer support'
                    ].map((benefit, index) => (
                      <Flex key={index} gap="2" align="center">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <Text size="2" color="gray" className="text-sm">
                          {benefit}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </div>

                {/* Sign In Link */}
                <Flex direction="column" align="center" gap="2" className="mt-2">
                  <Text size="2" color="gray" className="text-sm">
                    Already have an account?
                  </Text>
                  <Button
                    variant="soft"
                    onClick={() => navigate('/login')}
                    className="w-full text-sm sm:text-base py-2"
                  >
                    Sign in
                  </Button>
                </Flex>
              </Flex>
            </div>
          </Box>
        </div>
      </div>
    </Theme>
  );
};

export default Signup;