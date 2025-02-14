import '@mantine/core/styles.css';
import './global.css';
import React from 'react';
import QueryClientProvider from '@/Providers/QueryClientProvider';
import UserInfoProvider from '@/Providers/UserInfoProvider';
import MantineProvider from '@/Providers/MantineProvider';

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider>
          <QueryClientProvider>
            <UserInfoProvider>{children}</UserInfoProvider>
          </QueryClientProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
