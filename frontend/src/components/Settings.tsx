import React, { useState, useEffect } from 'react';
import { Theme, Flex, Text, Button, Box, TextField } from '@radix-ui/themes';
import { getUserProfile, updateProfile } from '../services/api';
import toast from 'react-hot-toast';

interface SettingsProps {
  onProfileUpdate?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onProfileUpdate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await getUserProfile();
        setFullName(profile.full_name);
        setEmail(profile.email);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({ fullName, email });
      toast.success('Profile updated successfully');
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Text>Loading profile...</Text>
      </div>
    );
  }

  return (
    <Theme appearance="light">
      <div className="p-6">
        <Box className="max-w-2xl mx-auto">
          <Flex direction="column" gap="4">
            <Text size="6" weight="bold">Account Settings</Text>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <Flex direction="column" gap="4">
                <div>
                  <label className="block mb-2">
                    <Text size="2" weight="bold">Full Name</Text>
                  </label>
                  <TextField.Root>
                    <TextField.Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </TextField.Root>
                </div>

                <div>
                  <label className="block mb-2">
                    <Text size="2" weight="bold">Email Address</Text>
                  </label>
                  <TextField.Root>
                    <TextField.Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </TextField.Root>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="mt-4"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </Flex>
            </form>

            <Box className="mt-8">
              <Text size="3" weight="bold" className="mb-4">
                Danger Zone
              </Text>
              <Box className="bg-red-50 border border-red-200 rounded-lg p-4">
                <Text size="2" color="red">
                  Delete your account
                </Text>
                <Text size="2" color="gray" className="mt-1">
                  Once you delete your account, there is no going back. Please be certain.
                </Text>
                <Button 
                  color="red" 
                  variant="soft"
                  className="mt-4"
                  onClick={() => {
                    // We'll implement this later
                    toast.error('Account deletion not implemented yet');
                  }}
                >
                  Delete Account
                </Button>
              </Box>
            </Box>
          </Flex>
        </Box>
      </div>
    </Theme>
  );
};

export default Settings;
