'use client';

import React from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { Button, TextInput, PasswordInput, Group, Box, Text } from '@mantine/core';
import { z } from 'zod';
import { IconAlertCircle } from '@tabler/icons-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const form = useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(loginSchema),
  });

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      // await onSubmit(values);
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  return (
    <Box maw={400} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email"
          autoFocus
          autoComplete="off"
          placeholder="your-email@example.com"
          {...form.getInputProps('email')}
        />

        <PasswordInput
          label="Password"
          autoComplete="off"
          placeholder="Your password"
          mt="md"
          {...form.getInputProps('password')}
        />

        <Group mt="lg" grow>
          <Button type="submit" radius="xl">
            Sign in
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default LoginForm;
