import React, { useState } from 'react';
import { Theme, Flex, Text, Button, Box, TextField } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle, signupWithEmail } from '../services/api';
import toast from 'react-hot-toast';
import '@radix-ui/themes/styles.css';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signupWithEmail(email, password, fullName);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to sign up';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Theme appearance="light" accentColor="blue" radius="medium">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4 relative">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 10%, rgba(59,130,246,0.06), transparent 35%), radial-gradient(circle at 80% 90%, rgba(6,182,212,0.06), transparent 35%)' }} />
          <div className="absolute inset-0 pointer-events-none opacity-[0.3]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        </div>
        {/* Card Container - 1/3 width on medium+ screens */}
        <div className="w-full md:w-1/3 min-w-[320px] max-w-md px-2 sm:px-0">
          <Box className="bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5 border border-gray-100">
            {/* Card Header */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 opacity-95" />
              <div className="relative px-6 py-5">
                <div 
                  onClick={() => navigate('/')}
                  className="text-xl sm:text-2xl font-extrabold text-white cursor-pointer text-center"
                >
                  GetCovered.io
                </div>
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
                    className="text-xl"
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

                {/* Email Sign Up Form */}
                <form onSubmit={handleEmailSignup} className="space-y-4">
                  <div className="space-y-2">
                    <TextField.Root>
                      <TextField.Input
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </TextField.Root>
                    <TextField.Root>
                      <TextField.Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </TextField.Root>
                    <TextField.Root>
                      <TextField.Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </TextField.Root>
                  </div>

                  {error && (
                    <Text color="red" size="2" className="text-center">
                      {error}
                    </Text>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all"
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign Up Button */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <button
                    type="button"
                    onClick={loginWithGoogle}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-200 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
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
                    className="w-full text-sm sm:text-base py-2 backdrop-blur bg-white/70 hover:bg-white/90 border border-gray-200"
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