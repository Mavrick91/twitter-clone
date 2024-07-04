import React, { useEffect, useState } from 'react';
import {
  Box,
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
      const daysInMonth = getDaysInMonth(new Date(parseInt(year), parseInt(month) - 1));
      console.log('😀😀 daysInMonth ~ ', daysInMonth);
      setDays(
        Array.from({ length: daysInMonth }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` }))
      );

      // Reset day if it's greater than the number of days in the new month
      if (parseInt(form.values.day) > daysInMonth) {
        form.setFieldError('day', 'Invalid date');
      }
    } else {
      // If month or year is not set, reset days to a full month
      setDays(Array.from({ length: 31 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` })));
    }
  }, [month, year]);

  const handleSubmit = async (values: SignUpFormValues) => {
    try {
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

      // Proceed with form submission
      console.log('Form submitted:', values);
      // await onSubmit(values);
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      withCloseButton={false}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      centered
      size="lg"
    >
      <Box p="xl">
        <div className="px-20">
          <Title order={1} className="my-6 text-white">
            Create your account
          </Title>
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
            <Flex gap="md" className="mb-40">
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

            <Group mt="lg" grow>
              <Button type="submit" radius="xl" size="lg">
                Sign up
              </Button>
            </Group>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default SignUpModal;
