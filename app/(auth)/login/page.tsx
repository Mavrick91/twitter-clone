import { Button } from '@mantine/core';
import WelcomeTwitter from '@/assets/svg/welcomeTwitter';
import LoginForm from '@/app/(auth)/login/_components/LoginForm';

type LoginPageProps = {};

const LoginPage = ({}: LoginPageProps) => (
  <main className="h-full flex bg-black">
    <div className="flex-1 flex-center">
      <div className="text-white max-h-[45vw] flex-center w-full">
        <WelcomeTwitter />
      </div>
    </div>
    <div className="flex-1 text-white py-14 flex-col flex px-6">
      <div className="display flex flex-col justify-center grow">
        <h1 className="mb-12 text-6xl font-bold">Happening now</h1>
        <span className="font-bold text-3xl">Join today</span>
        <div className="mt-8 max-w-72">
          <LoginForm />

          <div className="flex items-center my-2">
            <div className="h-px border-b border-[#2f3336] grow" />
            <div className="px-1">or</div>
            <div className="h-px border-b border-[#2f3336] grow" />
          </div>

          <Button fullWidth type="submit" radius="xl" variant="outline">
            Sign up
          </Button>
        </div>
      </div>
    </div>
  </main>
);

export default LoginPage;
