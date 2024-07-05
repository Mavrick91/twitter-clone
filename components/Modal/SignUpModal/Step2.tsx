import { TextInput } from '@mantine/core';
import React from 'react';
import { IconAt } from '@tabler/icons-react';
import { useSignupFormContext } from '@/components/Modal/SignUpModal/formContext';

const Step2 = () => {
  const form = useSignupFormContext();

  return (
    <>
      <TextInput
        autoFocus
        placeholder="First name"
        size="xl"
        {...form.getInputProps('firstName')}
      />
      <TextInput mt="md" placeholder="Last name" size="xl" {...form.getInputProps('lastName')} />
      <TextInput
        mt="md"
        mb="xl"
        leftSection={<IconAt size={16} />}
        placeholder="Username"
        size="xl"
        {...form.getInputProps('username')}
      />
    </>
  );
};

export default Step2;
