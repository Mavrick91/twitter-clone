'use client';

import { useState } from 'react';
import HomeTab, { TabOption } from '@/app/(main)/home/_components/HomeTab';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<TabOption>('you');

  const handleTabChange = (tab: TabOption) => {
    setActiveTab(tab);
  };
  return (
    <div className="w-[600px] border-l border-r border-separator">
      <HomeTab activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default HomePage;
