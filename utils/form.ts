import { UseFormReturnType } from '@mantine/form';

export const validateFormFields = async <T>(
  form: UseFormReturnType<T>,
  fieldsToValidate: string[]
): Promise<boolean> => {
  const validationResults = await Promise.all(
    fieldsToValidate.map(async (field) => ({
      ...form.validateField(field as string),
      field,
    }))
  );

  let hasErrors = false;

  validationResults.forEach((result) => {
    if (result.hasError) {
      form.setFieldError(result.field as string, result.error);
      hasErrors = true;
    }
  });

  return hasErrors;
};
