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
      window.location.href = '/signin';
    } catch (error) {
      toast.error('Failed to log out');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <Box className="max-w-2xl mx-auto">
          <div className="space-y-6 animate-pulse">
            <div className="h-7 w-40 bg-gray-200 rounded" />

            <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
              {/* Full Name */}
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-200 rounded" />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-200 rounded" />
              </div>

              {/* Avatar URL */}
              <div className="space-y-2">
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-200 rounded" />
              </div>

              <div className="h-10 w-36 bg-gray-200 rounded" />
            </div>

            {/* Session */}
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded" />
            </div>

            {/* Danger Zone */}
            <div className="space-y-3">
              <div className="h-5 w-28 bg-gray-200 rounded" />
              <div className="h-24 w-full bg-gray-200 rounded" />
              <div className="h-10 w-40 bg-gray-200 rounded" />
            </div>
          </div>
        </Box>
      </div>
    );
  }

  return (
    <Theme appearance="light">
      <div className="p-4 sm:p-6 relative">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 10%, rgba(59,130,246,0.06), transparent 35%), radial-gradient(circle at 80% 90%, rgba(6,182,212,0.06), transparent 35%)' }} />
          <div className="absolute inset-0 pointer-events-none opacity-[0.3]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        </div>
        <Box className="mx-auto px-2 sm:px-0 max-w-none md:max-w-2xl">
          <Flex direction="column" gap="4">
            <Text size="6" weight="bold">Account Settings</Text>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <Flex direction="column" gap="4">
                <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500">
                  <div className="rounded-2xl bg-white p-4">
                  <label className="block mb-2">
                    <Text size="2" weight="bold">Full Name</Text>
                  </label>
                  <TextField.Root className="w-full">
                    <TextField.Input
                      className="w-full"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </TextField.Root>
                  </div>
                </div>

                <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500">
                  <div className="rounded-2xl bg-white p-4">
                  <label className="block mb-2">
                    <Text size="2" weight="bold">Email Address</Text>
                  </label>
                  <TextField.Root className="w-full">
                    <TextField.Input
                      className="w-full bg-gray-100 cursor-not-allowed"
                      type="email"
                      value={email}
                      readOnly
                    />
                  </TextField.Root>
                  </div>
                </div>

                <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500">
                  <div className="rounded-2xl bg-white p-4">
                  <label className="block mb-2">
                    <Text size="2" weight="bold">Avatar URL</Text>
                  </label>
                  <TextField.Root className="w-full">
                    <TextField.Input
                      className="w-full"
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/avatar.png"
                    />
                  </TextField.Root>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </Flex>
            </form>

            <Box className="mt-4 sm:mt-6">
              <Text size="2" weight="bold" className="mb-2">
                Session
              </Text>
              <Button 
                variant="soft"
                color="gray"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full backdrop-blur bg-white/70 hover:bg-white/90 border border-gray-200"
              >
                {isLoggingOut ? 'Logging out...' : 'Log out'}
              </Button>
            </Box>

            <Box className="mt-6 sm:mt-8">
              <Text size="3" weight="bold" className="mb-4">
                Danger Zone
              </Text>
              <Box className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-6 flex flex-col">
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
