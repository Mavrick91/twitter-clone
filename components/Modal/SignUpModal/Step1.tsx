import { Flex, PasswordInput, Select, Text, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { format, getDaysInMonth } from 'date-fns';
import { useSignupFormContext } from '@/components/Modal/SignUpModal/formContext';

const Step1 = () => {
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

  const form = useSignupFormContext();
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

  return (
    <>
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
      <Text mt="lg" c="white" className="text-white font-bold">
        Date of birth
      </Text>
      <Text size="sm" mb="md">
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
    </>
  );
};

export default Step1;
