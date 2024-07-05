import React from 'react';
import { Button, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import UserAvatar from '@/components/UserAvatar';
import CharacterCounter from '@/components/CharacterCounter';
import ReplyPermissionsDropdown, {
  ReplyOption,
} from '@/app/(main)/home/_components/ReplyPermissionsDropdown';
import { createTweet } from '@/actions/tweet';
import { TweetCreateRequest } from '@/types/tweet';

const MAX_CHARACTERS = 280;

const schema = z.object({
  content: z.string(),
  reply_settings: z.optional(z.union([z.literal('following'), z.literal('mentionedUsers')])),
});

type schemaType = z.infer<typeof schema>;

const NewPostForm = () => {
  const form = useForm<schemaType>({
    initialValues: {
      content: '',
      reply_settings: undefined,
    },
    validate: {
      content: (value) => (!value ? 'Post content is required' : null),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: TweetCreateRequest) => createTweet(data),
    onSuccess: () => {
      form.setFieldValue('content', '');
    },
  });

  const handleSubmit = (values: schemaType) => {
    const payload: TweetCreateRequest = {
      text: values.content,
      reply_settings: values.reply_settings,
    };
    mutate(payload);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget;
    if (value.length <= MAX_CHARACTERS) {
      form.setFieldValue('content', value);
    }
  };

  const handlePermissionsChange = (value: ReplyOption) => {
    form.setFieldValue('reply_settings', value);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
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

            <ReplyPermissionsDropdown onSelect={handlePermissionsChange} />

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
                loading={isPending}
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
