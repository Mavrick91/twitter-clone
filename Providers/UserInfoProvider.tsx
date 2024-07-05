'use client';

import { onAuthStateChanged, signOut, User } from '@firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { LoadingOverlay } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { getDoc } from '@firebase/firestore';
import { doc } from 'firebase/firestore';
import { auth, firestore } from '@/lib/firebase';

type UserData = {
  email: string;
  dateOfBirth: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  username: string;
  // Add any other fields you store in Firestore
};

type UserInfo = {
  user: User | null;
  userData: UserData | null;
  logout?: () => void;
};

const UserInfoContext = createContext<UserInfo | undefined>(undefined);

type UserInfoProviderProps = {
  children: React.ReactNode;
};

const UserInfoProvider = ({ children }: UserInfoProviderProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ user: null, userData: null });
  const [visible, { toggle }] = useDisclosure(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            setUserInfo({ user: currentUser, userData });
          } else {
            setUserInfo({ user: currentUser, userData: null });
          }
        } catch (error) {
          setUserInfo({ user: currentUser, userData: null });
        }
      }

      toggle();
    });

    return () => unsubscribe();
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
    await signOut(auth);
    setUserInfo({ user: null, userData: null });
    router.push('/login');
  };

  if (visible) {
    return (
      <div className=" fixedinset-x-0 inset-y-0">
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
