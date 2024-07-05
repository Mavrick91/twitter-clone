'use client';

import React from 'react';
import { Box } from '@mantine/core';
import { initiateTwitterAuth } from '@/actions/auth';

const LoginForm = () => (
  <Box maw={400} mx="auto">
    <form action={initiateTwitterAuth}>
      <button type="submit">Sign in with Twitter</button>
    </form>
  </Box>
);

export default LoginForm;
