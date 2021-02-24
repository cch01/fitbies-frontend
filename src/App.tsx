import React, { useEffect } from 'react';
import {
  Route, Switch, useHistory,
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

const App: React.FC = observer(() => {
  const { authStore } = useStores();
  const history = useHistory();
  const [redirect] = useQueryParam('redirect', StringParam);

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
            <Route path="/activation/:token" component={AuthRouter} />
            <Route path="/registered" component={AuthRouter} />
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
