import { createFormContext } from '@mantine/form';
import { SignUpFormValues } from '@/components/Modal/SignUpModal/index';

export const [SignupProvider, useSignupFormContext, useSignupForm] =
  createFormContext<SignUpFormValues>();
