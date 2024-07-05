'use client';

import React from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { Alert, Box, Button, Group, PasswordInput, TextInput } from '@mantine/core';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { auth } from '@/lib/firebase';

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

  const {
    mutateAsync: signIn,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      await signInWithEmailAndPassword(auth, values.email, values.password);
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await signIn(values);
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  return (
    <Box maw={400} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        {isError && (
          <Alert variant="filled" color="red" mb="lg">
            Password or email is incorrect
          </Alert>
        )}

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
          <Button type="submit" radius="xl" loading={isPending}>
            Sign in
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default LoginForm;
