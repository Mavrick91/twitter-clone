import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Flex,
  Group,
  Modal,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { format, getDaysInMonth, isValid, parse, subYears } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { createUserWithEmailAndPassword, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '@/lib/firebase'; // Updated import

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
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUpModal = ({ opened, close }: SignUpModalProps) => {
  const [months] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      value: `${i + 1}`,
      label: format(new Date(2000, i, 1), 'MMMM'),
    }))
  );
  const [days, setDays] = useState<{ value: string; label: string }[]>([]);
  const [years] = useState(() =>
    Array.from({ length: 100 }, (_, i) => {
      const year = new Date().getFullYear() - i;
      return { value: `${year}`, label: `${year}` };
    })
  );

  const saveUserToFirestore = async (user: User, values: SignUpFormValues) => {
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, {
      email: values.email,
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

  const form = useForm<SignUpFormValues>({
    initialValues: {
      email: '',
      password: '',
      month: '',
      day: '',
      year: '',
    },
    validate: zodResolver(signUpSchema),
    validateInputOnChange: true,
  });

  const { month, year } = form.values;

  useEffect(() => {
    if (month && year) {
      const daysInMonth = getDaysInMonth(new Date(parseInt(year, 10), parseInt(month, 10) - 1));
      setDays(
        Array.from({ length: daysInMonth }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` }))
      );

      if (parseInt(form.values.day, 10) > daysInMonth) {
        form.setFieldError('day', 'Invalid date');
      }
    } else {
      setDays(Array.from({ length: 31 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` })));
    }
  }, [month, year]);

  const handleSubmit = async (values: SignUpFormValues) => {
    const dateString = `${values.year}-${values.month.padStart(2, '0')}-${values.day.padStart(2, '0')}`;
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

    try {
      await signUp(values);
      handleClose();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClose = () => {
    form.reset();
    reset();
    close();
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
    >
      <div className="px-20">
        <Title order={1} className="my-6 text-white">
          Create your account
        </Title>

        {isError && (
          <Alert variant="light" color="red" className="mb-4">
            This email is already associated with an account. Please try logging in instead.
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            autoFocus
            placeholder="your-email@example.com"
            size="xl"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            size="xl"
            placeholder="Your password"
            mt="md"
            {...form.getInputProps('password')}
          />
          <Text className="mt-6 text-white font-bold">Date of birth</Text>
          <Text size="sm" className="mb-4">
            This will not be shown publicly. Confirm your own age, even if this account is for a
            business, a pet, or something else.
          </Text>
          <Flex gap="md" className="mb-24">
            <Select
              allowDeselect={false}
              data={months}
              placeholder="Month"
              {...form.getInputProps('month')}
            />
            <Select
              allowDeselect={false}
              data={days}
              placeholder="Day"
              {...form.getInputProps('day')}
            />
            <Select
              allowDeselect={false}
              data={years}
              placeholder="Year"
              {...form.getInputProps('year')}
            />
          </Flex>

          <Group mt="lg" grow mb="lg">
            <Button type="submit" radius="xl" size="lg" loading={isPending}>
              Sign up
            </Button>
          </Group>
        </form>
      </div>
    </Modal>
  );
};

export default SignUpModal;
