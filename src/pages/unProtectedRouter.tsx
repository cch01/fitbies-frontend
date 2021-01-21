import React, { lazy, Suspense, useEffect } from 'react';
import Peer from 'peerjs';
import {
  BrowserRouter as Router, Route, Switch,
  useLocation, useHistory, Redirect,
} from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import 'react-toastify/dist/ReactToastify.css';
import { observer } from 'mobx-react';
import { useStores } from 'hooks/useStores';
import LoadingScreen from 'components/loadingScreen';
import AuthLayout from 'layout/authLayout';

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
const LoginPage: React.LazyExoticComponent<React.FC> = lazy(() => import('pages/auth'));

const UnProtectedRouter: React.FC = observer(() => (
  <AuthLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        <Route exact path="/landing" component={Landing} />
        <Route exact path="/login" component={LoginPage} />
      </Switch>
    </Suspense>
  </AuthLayout>
));

export default UnProtectedRouter;
