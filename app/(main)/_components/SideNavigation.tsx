'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Text } from '@mantine/core';
import { GoHome } from 'react-icons/go';
import { BiSearchAlt2 } from 'react-icons/bi';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

import classNames from 'classnames';
import WelcomeTwitter from '@/assets/svg/welcomeTwitter';
import { useUserInfo } from '@/Providers/UserInfoProvider';
import UserAvatar from '@/components/UserAvatar';

const SideNavigation = () => {
  const pathname = usePathname();
  const { logout, user } = useUserInfo();

  const navItems = [{ Icon: GoHome, label: 'Home', path: '/home' }];

  return (
    <div className="w-[275px] flex flex-col shrink-0">
      <div className="h-full flex flex-col">
        <div className="size-8 m-3">
          <WelcomeTwitter />
        </div>

        <div className="flex flex-col justify-between grow">
          <div className="flex flex-col">
            {navItems.map(({ path, Icon, label }) => {
              const isActive = pathname === path;

              return (
                <div className="flex items-center gap-5 p-3">
                  <Icon className="size-8" strokeWidth={isActive ? 0.4 : 0.01} />
                  <Link
                    className={classNames('text-xl', {
                      'font-bold': isActive,
                    })}
                    href={path}
                  >
                    {label}
                  </Link>
                </div>
              );
            })}
          </div>

          <Menu shadow="md" width={300} offset={10}>
            <Menu.Target>
              <button type="button" className="flex m-3 mb-6 justify-between items-center">
                <div className="flex items-center gap-3">
                  <UserAvatar />
                  <div className="flex flex-col items-start">
                    <Text c="white">{user?.name}</Text>
                    <Text size="sm" className="text-gray-400">
                      @{user?.username}
                    </Text>
                  </div>
                </div>
                <HiOutlineDotsHorizontal size={24} />
              </button>
            </Menu.Target>

            <Menu.Dropdown className="shiny-shadow border-none">
              <Menu.Label>
                <Text className="font-bold" c="white" component="button" onClick={logout}>
                  Log out @{user?.username}
                </Text>
              </Menu.Label>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;
