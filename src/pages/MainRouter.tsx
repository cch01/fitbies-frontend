import React, { lazy, useEffect, Suspense } from 'react';
import Layout from 'layout/app';
import {
  Route, Switch, useHistory, useLocation,
} from 'react-router-dom';
import { useStores } from 'hooks/useStores';
import { observer } from 'mobx-react';
import LoadingScreen from 'components/loadingScreen';
import MeetingLayout from 'layout/meetingLayout';

const Meeting: React.LazyExoticComponent<React.FC> = lazy(() => import('pages/meeting'));
const JoinMeetingPage: React.LazyExoticComponent<React.FC> = lazy(() => import('pages/joinMeeting'));
const HostMeetingPage: React.LazyExoticComponent<React.FC> = lazy(() => import('pages/hostMeeting'));
const NotFound: React.FC = () => (<div>404 NOT FOUND.</div>);

const MainRouter: React.FC = observer(() => {
  const history = useHistory();
  const { authStore } = useStores();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/') {
      history.push('/landing');
    }
  }, [authStore.isRegistered]);
  return (
    <Switch>
      <Route path="/meeting">
        <MeetingLayout>
          <Suspense fallback={<LoadingScreen width="850px" />}>
            <Meeting />
          </Suspense>
        </MeetingLayout>
      </Route>
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Switch>
            <Route path="/host" component={HostMeetingPage} />
            <Route path="/join" component={JoinMeetingPage} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Layout>
    </Switch>
  );
});

export default MainRouter;
