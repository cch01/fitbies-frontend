import React, { lazy, useEffect, Suspense } from 'react';
import Layout from 'layout/app';
import {
  Route, Switch, useHistory, useLocation,
} from 'react-router-dom';
import { useStores } from 'hooks/useStores';
import { observer } from 'mobx-react';
import LoadingScreen from 'components/loadingScreen';

const Meeting: React.LazyExoticComponent<React.FC> = lazy(() => import('pages/meeting'));
const JoinMeetingPage: React.LazyExoticComponent<React.FC> = lazy(() => import('pages/joinMeeting'));

const ProtectedRouter: React.FC = observer(() => {
  const history = useHistory();
  const { authStore } = useStores();
  const location = useLocation();
  useEffect(() => {
    if (!authStore.isLoggedIn) {
      history.push({
        pathname: '/landing',
        search: location.pathname === '/' ? '' : `?redirect=${encodeURIComponent(location.pathname + location.search)}`,
      });
    }
  }, [authStore.isLoggedIn]);
  return (
    <Layout>
      <Suspense fallback={<LoadingScreen />}>
        <Switch>
          <Route path="/meeting" component={Meeting} />
          <Route path="/join" component={JoinMeetingPage} />
          {/* <Route path="/host" component={Meeting} /> */}
        </Switch>
      </Suspense>
    </Layout>
  );
});

export default ProtectedRouter;
