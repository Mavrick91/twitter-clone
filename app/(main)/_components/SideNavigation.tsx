'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, Menu, Text } from '@mantine/core';
import { GoHome } from 'react-icons/go';
import { BiSearchAlt2 } from 'react-icons/bi';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

import classNames from 'classnames';
import WelcomeTwitter from '@/assets/svg/welcomeTwitter';
import { useUserInfo } from '@/Providers/UserInfoProvider';

const navItems = [
  { Icon: GoHome, label: 'Home', path: '/home' },
  { Icon: BiSearchAlt2, label: 'Explore', path: '/explore' },
];

const SideNavigation = () => {
  const pathname = usePathname();
  const { logout } = useUserInfo();

  return (
    <div className="debug w-[275px] flex flex-col shrink-0">
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

          <Menu shadow="md" width={300}>
            <Menu.Target>
              <button type="button" className="flex m-3 justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar color="cyan" radius="xl">
                    MK
                  </Avatar>
                  <Text c="white">Martin Kingdom</Text>
                </div>
                <HiOutlineDotsHorizontal size={24} />
              </button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>
                <Text className="font-bold" c="white" component="button" onClick={logout}>
                  Log out @MartinKingdom
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
