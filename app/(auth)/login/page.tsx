import WelcomeTwitter from '@/assets/svg/welcomeTwitter';
import LoginForm from '@/app/(auth)/login/_components/LoginForm';

const LoginPage = () => (
  <main className="h-full flex bg-black">
    <div className="flex-1 flex-center">
      <div className="text-[#e7e9ea] max-h-[380px] h-1/2 self-center flex justify-center">
        <WelcomeTwitter />
      </div>
    </div>
    <div className="flex-1 text-white py-14 flex-col flex px-6">
      <div className="display flex flex-col justify-center grow">
        <h1 className="mb-12 text-6xl font-bold">Happening now</h1>
        <span className="font-bold text-3xl">Join today</span>
        <div className="mt-8 max-w-72">
          <LoginForm />
        </div>
      </div>
    </div>
  </main>
);

export default LoginPage;
