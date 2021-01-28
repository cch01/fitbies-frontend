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
const CreateMeetingPage: React.LazyExoticComponent<React.FC> = lazy(() => import('pages/createMeeting'));
const NotFound: React.FC = () => (<div>404 NOT FOUND.</div>);

const MainRouter: React.FC = observer(() => {
  const history = useHistory();
  const { authStore } = useStores();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/') {
      history.push('/landing');
    }
  }, [authStore.isLoggedIn]);
  return (
    <Layout>
      <Suspense fallback={<LoadingScreen />}>
        <Switch>
          <Route path="/meeting" component={Meeting} />
          <Route path="/host" component={CreateMeetingPage} />
          <Route path="/join" component={JoinMeetingPage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
});

export default MainRouter;
