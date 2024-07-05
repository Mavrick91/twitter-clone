import { Button, Menu, Text, useMantineTheme } from '@mantine/core';
import React, { useState } from 'react';
import {
  IconAt,
  IconUsers,
  IconWorld,
  // @ts-ignore
  TablerIconsProps,
} from '@tabler/icons-react';

export type ReplyOption = 'following' | 'mentionedUsers' | undefined;

interface ReplyPermissionsDropdownProps {
  onSelect: (option: ReplyOption) => void;
}

interface OptionType {
  value: ReplyOption;
  label: string;
  translation: string;
  Icon: React.ComponentType<TablerIconsProps>;
}

const options: OptionType[] = [
  {
    value: undefined,
    label: 'Everyone',
    translation: 'Everyone can reply',
    Icon: IconWorld,
  },
  {
    value: 'following',
    label: 'Accounts you follow',
    translation: 'Accounts you follow can reply',
    Icon: IconUsers,
  },
  {
    value: 'mentionedUsers',
    label: 'Only accounts you mention',
    translation: 'Only accounts you mention can reply',
    Icon: IconAt,
  },
];

const ReplyPermissionsDropdown = ({ onSelect }: ReplyPermissionsDropdownProps) => {
  const theme = useMantineTheme();
  const [selected, setSelected] = useState<OptionType>(options[0]);
  const [opened, setOpened] = useState(false);

  const handleSelect = (option: OptionType) => {
    setSelected(option);
    onSelect(option.value);
    setOpened(false);
  };

  return (
    <Menu
      shadow="md"
      width={300}
      offset={-3}
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
    >
      <Menu.Target>
        <div className="border-b border-separator pb-2 mb-3">
          <Button
            className="px-3 mt-2 w-min"
            variant="subtle"
            leftSection={
              <div
                className="size-4"
                style={{
                  color: theme.colors.blue[4],
                }}
              >
                <selected.Icon size={16} />
              </div>
            }
          >
            <Text c="blue" size="sm" className="font-semibold">
              {selected.translation}
            </Text>
          </Button>
        </div>
      </Menu.Target>

      <Menu.Dropdown className="shiny-shadow border-none rounded-2xl">
        <Menu.Label>
          <Text className="font-bold" c="white">
            Who can reply?
          </Text>
          <Text size="xs" className="text-gray-400 mb-2">
            Choose who can reply to this post. Anyone mentioned can always reply.
          </Text>
        </Menu.Label>
        {options.map((option) => (
          <button
            type="button"
            key={option.value}
            onClick={() => handleSelect(option)}
            className="hover:bg-[#16181C] rounded-xl w-full p-3"
          >
            <div className="flex items-center gap-3">
              <div
                className="size-10 flex-center rounded-full"
                style={{
                  backgroundColor: theme.colors.blue[4],
                }}
              >
                <option.Icon size={20} />
              </div>
              <Text c="white" className="font-semibold">
                {option.label}
              </Text>
            </div>
          </button>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default ReplyPermissionsDropdown;
