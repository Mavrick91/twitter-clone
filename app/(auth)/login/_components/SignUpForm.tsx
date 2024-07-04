'use client';

import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import SignUpModal from '@/components/Modal/SignUpModal';

type SignUpFormProps = {};

const SignUpForm = ({}: SignUpFormProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button fullWidth onClick={open} type="submit" radius="xl" variant="outline">
        Sign up
      </Button>

      <SignUpModal opened={opened} close={close} />
    </>
  );
};

export default SignUpForm;
