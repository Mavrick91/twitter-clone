import { Avatar } from '@mantine/core';
import { useUserInfo } from '@/Providers/UserInfoProvider';

const UserAvatar = () => {
  const { user } = useUserInfo();

  if (!user?.profile_image_url) {
    const firstName = user?.name.split(' ')[0];
    const lastName = user?.name.split(' ')[1];

    return (
      <Avatar color="cyan" radius="xl" size={40}>
        {firstName}
        {lastName}
      </Avatar>
    );
  }

  return <Avatar src={user?.profile_image_url} radius="xl" size={40} />;
};

export default UserAvatar;
