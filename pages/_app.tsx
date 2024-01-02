import type { AppProps } from 'next/app';
import { ReactElement, ReactNode, Suspense } from 'react';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { Provider } from 'react-redux';
import store from '../store/index';
import Head from 'next/head';

import { appWithI18Next } from 'ni18n';
import { ni18nConfig } from 'ni18n.config.ts';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

import '../styles/tailwind.css';
import { NextPage } from 'next';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);


    // The pages that should not use the DefaultLayout
    const pagesWithoutLayout = ['Preview'];

    // Get the name of the current page component
    const currentPageName = Component.displayName || Component.name;

    // Check if the current page should use the layout
    const shouldUseLayout = !pagesWithoutLayout.includes(currentPageName);

    return (
        <Provider store={store}>
            <Head>
                <title>CIVIL TECHNO LAP</title>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="Generated by create next app" />
                {/* <link rel="icon" href="/favicon.png" /> */}
            </Head>

            {shouldUseLayout ? getLayout(<Component {...pageProps} />) : <Component {...pageProps} />}
        </Provider>
    );
};
export default appWithI18Next(App, ni18nConfig);
