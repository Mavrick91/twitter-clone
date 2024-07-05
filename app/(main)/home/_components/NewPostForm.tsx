import React from 'react';
import { Button, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import UserAvatar from '@/components/UserAvatar';
import CharacterCounter from '@/components/CharacterCounter';
import ReplyPermissionsDropdown from '@/app/(main)/home/_components/ReplyPermissionsDropdown';

const MAX_CHARACTERS = 280;

const NewPostForm = () => {
  const form = useForm({
    initialValues: {
      content: '',
    },
    validate: {
      content: (value) => (!value ? 'Post content is required' : null),
    },
  });

  const handleSubmit = form.onSubmit(() => {
    form.reset();
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget;
    if (value.length <= MAX_CHARACTERS) {
      form.setFieldValue('content', value);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="py-3 px-4 border-b border-separator">
        <div className="flex">
          <UserAvatar />
          <div className="w-full flex flex-col">
            <Textarea
              classNames={{
                input: 'border-none text-xl',
              }}
              placeholder="What is happening ?!"
              autosize
              minRows={1}
              value={form.values.content}
              onChange={handleInputChange}
              error={form.errors.content}
            />

            <ReplyPermissionsDropdown onSelect={(option) => console.log(option)} />

            <div className="ml-auto flex items-center space-x-3">
              {!!form.values.content.length && (
                <>
                  <CharacterCounter count={form.values.content.length} limit={MAX_CHARACTERS} />
                  <div className="border-r h-4/5 border-separator" />
                </>
              )}
              <Button
                type="submit"
                radius="xl"
                disabled={!form.isValid() || form.values.content.length === 0}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default NewPostForm;
