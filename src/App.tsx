import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ApolloProvider, useQuery } from '@apollo/client';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { useInitApollo } from 'hooks/useInitApollo';
import { observer } from 'mobx-react';
import { useStores } from 'hooks/useStores';
import { HelmetProvider } from 'react-helmet-async';
import MainRouter from 'pages/MainRouter';
import AuthRouter from 'pages/AuthRouter';
import MeGql from 'graphql/me';
import LoadingScreen from 'components/loadingScreen';
import _ from 'lodash';

const App: React.FC = observer(() => {
  const { authStore } = useStores();
  const { token: currentToken } = authStore;
  console.log('current Token', currentToken);
  const client = useInitApollo(currentToken, () => {
    console.warn('Clearing cookie...');
    authStore.logout();
  }, (token:string) => authStore.setToken(token.replace('Bearer ', '')));

  // TODO: fix fetch twice bug
  const { data, loading } = useQuery(MeGql, { client, skip: _.isEmpty(currentToken), fetchPolicy: 'network-only' });

  useEffect(() => {
    if (data?.me) {
      authStore.setViewer(data.me);
      toast.success(`Welcome, ${authStore.viewer.nickname} !`);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="height-100vh flex-row flex-x-center flex-y-center">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <ApolloProvider client={client}>
      <ToastContainer
        position="top-left"
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
