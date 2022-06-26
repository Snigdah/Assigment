import React, { useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../src/auth/auth-context';
import 'antd/dist/antd.css';
import '../global.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <AppLayout> */}
      <Head>
        <title>NextJs Antdesign Typescript</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
        {/* </AppLayout> */}
      </AuthProvider>
    </>
  );
}
