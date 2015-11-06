/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react';
import Router from 'react-routing/src/Router';
import http from './core/HttpClient';
import App from './components/App';
import HomePage from './components/HomePage';
import ContentPage from './components/ContentPage';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import NotFoundPage from './components/NotFoundPage';
import SearchPage from './components/SearchPage';
import ErrorPage from './components/ErrorPage';
import SummaryPage from './components/SummaryPage';

const router = new Router(on => {
  function use(route, cb) {
    on(route, async (state, next) => {
      state.context.params = state.params;

      return next();
    });

    on(route, cb);
  }

  on('*', async (state, next) => {
    state.context.query = state.query;
    const component = await next();
    return component && <App context={state.context}>{component}</App>;
  });

  use('/', async () => <HomePage />);

  use('/contact', async () => <ContactPage />);

  use('/login', async () => <LoginPage />);

  use('/register', async () => <RegisterPage />);

  use('/search/', async () => {
    return <SearchPage products={[]} />;
  });

  use('/search/:search', async (state) => {
    const content = await http.get(`/v1/naverProducts/${encodeURIComponent(state.params.search)}`);
    return content && <SearchPage products={content} search={state.params.search} />;
  });

  use('/summary/product/:productId', async (state) => {
    try {
      const content = await http.find(`products/${state.params.productId}/summary`);
      return content && <SummaryPage data={content} />;
    }
    catch (e) {
      return <ErrorPage />
    }

  });

  use('/summary/post/:search', async () => <SummaryPage />);

  on('*', async (state) => {
    const content = await http.get(`/api/content?path=${state.path}`);
    return content && <ContentPage {...content} />;
  });

  on('error', (state, error) => state.statusCode === 404 ?
    <App context={state.context} error={error} state={state}><NotFoundPage /></App> :
    <App context={state.context} error={error} state={state}><ErrorPage /></App>
  );
});

export default router;
