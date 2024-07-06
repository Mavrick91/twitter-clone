'use client';

import { useState } from 'react';
import HomeTab, { TabOption } from '@/app/(main)/home/_components/HomeTab';
import NewPostForm from '@/app/(main)/home/_components/NewPostForm';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<TabOption>('you');

  const handleTabChange = (tab: TabOption) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-[600px]">
      <HomeTab activeTab={activeTab} onTabChange={handleTabChange} />
      <NewPostForm />
    </div>
  );
};

export default HomePage;
