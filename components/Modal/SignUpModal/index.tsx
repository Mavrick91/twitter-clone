import React, { useState } from 'react';
import { Alert, Button, Group, Modal, Title } from '@mantine/core';
import { zodResolver } from '@mantine/form';
import { z } from 'zod';
import { isValid, parse, subYears } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { createUserWithEmailAndPassword, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { IconChevronLeft } from '@tabler/icons-react';
import { auth, firestore } from '@/lib/firebase';
import Step1 from '@/components/Modal/SignUpModal/Step1';
import { SignupProvider, useSignupForm } from '@/components/Modal/SignUpModal/formContext';
import Step2 from '@/components/Modal/SignUpModal/Step2';
import { validateFormFields } from '@/utils/form';

type SignUpModalProps = {
  opened: boolean;
  close: () => void;
};

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  month: z.string().min(1, 'Month is required'),
  day: z.string().min(1, 'Day is required'),
  year: z.string().min(1, 'Year is required'),
  firstName: z
    .string()
    .max(50, 'First name must be 50 characters or less')
    .refine((value) => value.trim().length > 0, 'First name is required')
    .refine(
      (value) => /^[a-zA-Z\s'-]*$/.test(value),
      'First name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  lastName: z
    .string()
    .max(50, 'Last name must be 50 characters or less')
    .refine((value) => value.trim().length > 0, 'Last name is required')
    .refine(
      (value) => /^[a-zA-Z\s'-]*$/.test(value),
      'Last name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  username: z
    .string()
    .min(4, 'Username must be at least 4 characters long')
    .max(15, 'Username must be 15 characters or less')
    .refine((value) => value.trim().length > 0, 'Username is required')
    .refine((value) => !/^\d+$/.test(value), 'Username cannot be entirely numeric'),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUpModal = ({ opened, close }: SignUpModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  const saveUserToFirestore = async (user: User, values: SignUpFormValues) => {
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, {
      ...values,
      dateOfBirth: `${values.year}-${values.month.padStart(2, '0')}-${values.day.padStart(2, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const {
    mutateAsync: signUp,
    isPending,
    reset,
    isError,
  } = useMutation({
    mutationFn: async (values: SignUpFormValues) => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      await saveUserToFirestore(userCredential.user, values);
    },
  });

  const form = useSignupForm({
    initialValues: {
      email: '',
      password: '',
      month: '',
      day: '',
      year: '',
      firstName: '',
      lastName: '',
      username: '',
    },
    validate: zodResolver(signUpSchema),
  });

  const handleClose = () => {
    form.reset();
    reset();
    setCurrentStep(1);
    close();
  };

  const handleSubmit = async (values: SignUpFormValues) => {
    try {
      await signUp(values);
      handleClose();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClickNext = async () => {
    if (currentStep === 1) {
      const fieldsToValidate = ['email', 'password', 'month', 'day', 'year'];
      const hasErrors = await validateFormFields(form, fieldsToValidate);

      const dateString = `${form.values.year}-${form.values.month.padStart(2, '0')}-${form.values.day.padStart(2, '0')}`;
      const date = parse(dateString, 'yyyy-MM-dd', new Date());

      if (!isValid(date)) {
        form.setFieldValue('day', '');
        return;
      }

      const minimumAge = subYears(new Date(), 13);
      if (date > minimumAge) {
        form.setFieldError('year', 'You must be at least 13 years old to sign up');
        return;
      }

      if (!hasErrors) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      form.onSubmit(handleSubmit)();
    }
  };

  const handleClickPreviousStep = () => {
    setCurrentStep(1);
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      centered
      size="lg"
      title={
        currentStep === 2 && (
          <button type="button" onClick={handleClickPreviousStep}>
            <IconChevronLeft size={24} />
          </button>
        )
      }
    >
      <div className="px-20">
        <Title order={1} c="white" mb="xl">
          Create your account
        </Title>

        {isError && (
          <Alert variant="filled" color="red" mb="lg">
            This email is already associated with an account. Please try logging in instead.
          </Alert>
        )}

        <SignupProvider form={form}>
          <form>
            {currentStep === 1 && <Step1 />}
            {currentStep === 2 && <Step2 />}
            <Group mt="lg" grow mb="lg">
              <Button onClick={handleClickNext} radius="xl" size="lg" loading={isPending}>
                {currentStep === 1 ? 'Next' : 'Sign up'}
              </Button>
            </Group>
          </form>
        </SignupProvider>
      </div>
    </Modal>
  );
};

export default SignUpModal;
