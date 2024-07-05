import React from 'react';
import classNames from 'classnames';

export type TabOption = 'you' | 'followings';

interface TabItemProps {
  label: string;
  isActive: boolean;
}

const TabItem: React.FC<TabItemProps> = ({ label, isActive }) => (
  <span
    className={classNames('h-full flex-center relative', {
      'font-bold': isActive,
      'opacity-70': !isActive,
    })}
  >
    {label}
    {isActive && <div className="absolute w-full bottom-0 h-1 bg-home-tab rounded-full" />}
  </span>
);

interface HomeTabProps {
  activeTab: TabOption;
  onTabChange: (tab: TabOption) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ activeTab, onTabChange }) => {
  const tabs: { key: TabOption; label: string }[] = [
    { key: 'you', label: 'For you' },
    { key: 'followings', label: 'Following' },
  ];

  return (
    <div className="border-b border-separator h-14 w-full flex">
      {tabs.map((tab) => (
        <button
          type="button"
          className="flex-1 flex-center"
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
        >
          <TabItem label={tab.label} isActive={activeTab === tab.key} />
        </button>
      ))}
    </div>
  );
};

export default HomeTab;
