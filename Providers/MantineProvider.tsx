import { MantineProvider as Provider } from '@mantine/core';
import theme from '@/constants/theme';

type MantineProviderProps = {
  children: React.ReactNode;
};

const MantineProvider = ({ children }: MantineProviderProps) => (
  <Provider theme={theme} forceColorScheme="dark">
    {children}
  </Provider>
);

export default MantineProvider;
