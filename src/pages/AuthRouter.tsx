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

const Landing: React.LazyExoticComponent<React.FC> = lazy(() => import('pages/landing'));
const LoginPage: React.LazyExoticComponent<React.FC> = lazy(() => import('pages/auth'));

const AuthRouter: React.FC = observer(() => (
  <AuthLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        <Route exact path="/landing" component={Landing} />
        <Route exact path="/login" component={LoginPage} />
      </Switch>
    </Suspense>
  </AuthLayout>
));

export default AuthRouter;
