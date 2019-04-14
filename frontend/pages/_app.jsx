import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import NProgress from 'nprogress';
import Router from 'next/router';
import { ApolloProvider } from 'react-apollo';
import { createGlobalStyle } from 'styled-components';
import withApollo from '../lib/withApollo';
import 'semantic-ui-css/semantic.min.css';
import 'normalize.css';

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-size: 62.5%;
    height: 100%;
  }

  body, #__next {
    height: 100%;
    min-height: 100%;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  h1, h2, h3, h4 {
    margin: 0;
  }

  body {
    font-size: 1.6rem;
    margin: 0;
    padding: 0;
    font-family: 'Poppins', Helvetica, sans-serif;
  }
  
  p {
    line-height: 1.6;
  }

  h1 {
    font-size: 3.2rem;
  }

  h2 {
    font-size: 2.4rem;
  }

  h3 {
    font-size: 1.9rem;
  }

  h4 {
    font-size: 1.6rem;
  }
`;

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, apollo } = this.props;

    return (
      <Container>
        <GlobalStyle />
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <title>Open Wallet</title>
        </Head>
        <ApolloProvider client={apollo}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApollo(MyApp);
