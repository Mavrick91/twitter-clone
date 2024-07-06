'use client';

import { IconChevronLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { Button } from '@mantine/core';
import { useUserInfo } from '@/Providers/UserInfoProvider';
import { pluralize } from '@/utils/string';

const HeaderBack = () => {
  const { user } = useUserInfo();

  return (
    <div className="flex items-center border-b border-separator px-3 h-14">
      <Button
        component={Link}
        href="/home"
        c="white"
        variant="subtle"
        radius="xl"
        className="aspect-square"
        p={0}
      >
        <IconChevronLeft />
      </Button>
      <div className="flex flex-col ml-5">
        <div className="text-white text-xl font-semibold">{user?.name}</div>
        <div className="text-xs text-gray-400">
          {user?.public_metrics?.tweet_count}{' '}
          {!!user?.public_metrics?.tweet_count &&
            pluralize(user.public_metrics.tweet_count, 'post', 'posts')}
        </div>
      </div>
    </div>
  );
};

export default HeaderBack;
