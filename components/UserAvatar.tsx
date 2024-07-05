import { Avatar } from '@mantine/core';
import { useUserInfo } from '@/Providers/UserInfoProvider';

const UserAvatar = () => {
  const { userData } = useUserInfo();

  return (
    <Avatar color="cyan" radius="xl" size={40}>
      {userData?.firstName[0]}
      {userData?.lastName[0]}
    </Avatar>
  );
};

export default UserAvatar;
