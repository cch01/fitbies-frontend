import React, { lazy, Suspense, useEffect } from 'react';
import Peer from 'peerjs';
import {
  BrowserRouter as Router, Route, Switch,
  useLocation, useHistory,
} from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useInitApollo } from 'hooks/useInitApollo';
import { observer } from 'mobx-react';
import { useStores } from 'hooks/useStores';
import LoadingScreen from 'pages/landing/components/loadingScreen';

// const id = (Math.random()*50).toString()
// console.log('id',id)
// const peer = new Peer(id, {host:'localhost', path:"/rooms", port: 3001 });
// const conn = peer.connect('another-peers-id');
// conn.on('open', () => {
//   conn.send('hi x 2!!, I am '+id);
// });

// peer.on('connection', (conn) => {
//   conn.on('data', (data) => {
//     // Will print 'hi!'
//     console.log(data);
//   });
//   conn.on('open', () => {
//     conn.send('hello! me is '+id);
//   });
// });

const Landing: React.LazyExoticComponent<React.FC> = lazy(() => import('pages/landing'));
const Meeting: React.LazyExoticComponent<React.FC> = lazy(() => import('pages/meeting'));

const App: React.FC = observer(() => {
  const { authStore } = useStores();
  console.log('current Token', authStore.token);
  const client = useInitApollo(authStore.token, () => {
    // eslint-disable-next-line no-console
    console.warn('Clearing cookie...');
    authStore.logout();
  }, (token:string) => authStore.setToken(token.replace('Bearer ', '')));
  useEffect(() => {
    console.log('token changed');
  }, [authStore.token]);
  useEffect(() => {
    console.log('client instance changed');
  }, [client]);
  const history = useHistory();
  const location = useLocation();

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
      <div className="App">
        <Suspense fallback={<LoadingScreen />}>
          <Switch>
            <Route exact path="/landing" component={Landing} />
            <Route exact path="/" component={Meeting} />
          </Switch>
        </Suspense>
      </div>
    </ApolloProvider>
  );
});

export default App;
