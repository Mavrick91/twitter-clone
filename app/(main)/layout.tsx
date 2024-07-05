import SideNavigation from '@/app/(main)/_components/SideNavigation';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => (
  <div className="debug w-[1255px] mx-auto flex h-screen">
    <SideNavigation />
    {children}
  </div>
);

export default MainLayout;
