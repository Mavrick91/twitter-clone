'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { LoadingOverlay } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { getUserData, isAuthenticated, logout } from '@/actions/auth';
import { TwitterUserData } from '@/types/user';

type UserInfo = {
  user: TwitterUserData | null;
  logout?: () => Promise<void>;
};

const UserInfoContext = createContext<UserInfo | undefined>(undefined);

type UserInfoProviderProps = {
  children: React.ReactNode;
};

const UserInfoProvider = ({ children }: UserInfoProviderProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ user: null });
  const [visible, { toggle }] = useDisclosure(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await isAuthenticated();
        if (isAuth) {
          const userData = await getUserData();
          console.log('😀😀 userData ~ ', userData);
          setUserInfo({ user: userData });
        } else {
          setUserInfo({ user: null });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUserInfo({ user: null });
      }
      toggle();
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!visible) {
      if (!userInfo.user && pathname !== '/login') {
        router.push('/login');
      } else if (userInfo.user && (pathname === '/login' || pathname === '/')) {
        router.push('/home');
      }
    }
  }, [userInfo, visible, pathname]);

  const handleLogout = async () => {
    await logout();
    setUserInfo({ user: null });
    router.push('/login');
  };

  if (visible) {
    return (
      <div className="fixed inset-x-0 inset-y-0">
        <LoadingOverlay visible={visible} zIndex={1000} />
      </div>
    );
  }

  return (
    <UserInfoContext.Provider value={{ ...userInfo, logout: handleLogout }}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserInfo = () => {
  const context = useContext(UserInfoContext);
  if (context === undefined) {
    throw new Error('useUserInfo must be used within a UserInfoProvider');
  }
  return context;
};

export default UserInfoProvider;
