import SideNavigation from '@/app/(main)/_components/SideNavigation';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => (
  <div className="w-[1255px] mx-auto flex h-screen">
    <SideNavigation />
    <div className="border-l border-r border-separator">{children}</div>
  </div>
);

export default MainLayout;
