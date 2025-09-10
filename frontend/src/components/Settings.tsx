import React, { useState, useEffect } from 'react';
import { Theme, Flex, Text, Button, Box, TextField } from '@radix-ui/themes';
import { getUserProfile, updateProfile, logout, deleteMyAccount, getAdminProfile, checkAuthStatus } from '../services/api';
import toast from 'react-hot-toast';

interface SettingsProps {
  onProfileUpdate?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onProfileUpdate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const auth = await checkAuthStatus();
        const profile = auth?.is_admin ? await getAdminProfile() : await getUserProfile();
        setFullName(profile.full_name);
        setEmail(profile.email);
        setAvatarUrl(profile.avatar_img || '');
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
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedAvatar = avatarUrl.trim();

    // Email cannot be changed; no validation necessary

    if (trimmedAvatar && !/^https?:\/\//i.test(trimmedAvatar)) {
      toast.error('Avatar URL must start with http:// or https://');
      return;
    }
    setIsSaving(true);

    try {
      await updateProfile({
        fullName: trimmedName || undefined,
        email: trimmedEmail,
        avatarUrl: trimmedAvatar || undefined
      });
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

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      window.location.href = '/login';
    } catch (error) {
      toast.error('Failed to log out');
    } finally {
      setIsLoggingOut(false);
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
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </TextField.Root>
                </div>

                <div>
                  <label className="block mb-2">
                    <Text size="2" weight="bold">Avatar URL</Text>
                  </label>
                  <TextField.Root>
                    <TextField.Input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/avatar.png"
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

            <Box className="mt-6">
              <Text size="2" weight="bold" className="mb-2">
                Session
              </Text>
              <Button 
                variant="soft"
                color="gray"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full"
              >
                {isLoggingOut ? 'Logging out...' : 'Log out'}
              </Button>
            </Box>

            <Box className="mt-8">
              <Text size="3" weight="bold" className="mb-4">
                Danger Zone
              </Text>
              <Box className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 flex flex-col">
                <Text size="2" color="red" className="text-sm sm:text-base font-semibold">
                  Delete your account
                </Text>
                <Text size="2" color="gray" className="mt-1 text-xs sm:text-sm leading-relaxed">
                  Once you delete your account, there is no going back. Please be certain.
                </Text>
                <Button 
                  color="red" 
                  variant="soft"
                  className="w-full mt-6 sm:mt-8"
                  onClick={async () => {
                    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
                    if (!confirmDelete) return;
                    try {
                      await deleteMyAccount();
                      toast.success('Account deleted');
                      await logout();
                      window.location.href = '/signup';
                    } catch (error: any) {
                      toast.error(error.response?.data?.error || 'Failed to delete account');
                    }
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
