import React, { lazy, useEffect } from 'react';
import {
  Route, Switch, useLocation, useHistory,
} from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useInitApollo } from 'hooks/useInitApollo';
import { observer } from 'mobx-react';
import { useStores } from 'hooks/useStores';
import { HelmetProvider } from 'react-helmet-async';
import { StringParam, useQueryParam } from 'use-query-params';
import MainRouter from 'pages/MainRouter';
import AuthRouter from 'pages/AuthRouter';

const Landing: React.LazyExoticComponent<React.FC> = lazy(() => import('pages/landing'));
const Auth: React.LazyExoticComponent<React.FC> = lazy(() => import('pages/auth'));

const App: React.FC = observer(() => {
  const { authStore } = useStores();
  const history = useHistory();
  const location = useLocation();
  const [redirect, setRedirect] = useQueryParam('redirect', StringParam);
  // TODO: check join strings
  console.log('current Token', authStore.token);
  const client = useInitApollo(authStore.token, () => {
    console.warn('Clearing cookie...');
    authStore.logout();
  }, (token:string) => authStore.setToken(token.replace('Bearer ', '')));
  useEffect(() => {
    console.log('token changed');
  }, [authStore.token]);
  useEffect(() => {
    console.log('client instance changed');
  }, [client]);

  useEffect(() => {
    if (authStore.isRegistered) {
      history.push(redirect ?? '/landing');
    }
  }, [authStore.isRegistered]);

  return (
    <ApolloProvider client={client}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
      <HelmetProvider>
        <div className="App">
          <Switch>
            <Route exact path="/activation/:token" component={AuthRouter} />
            <Route path="/landing" component={AuthRouter} />
            <Route path="/login" component={AuthRouter} />
            <Route path="/" component={MainRouter} />
          </Switch>
        </div>
      </HelmetProvider>
    </ApolloProvider>
  );
});

export default App;
