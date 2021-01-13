import {
  useMutation, useApolloClient, useSubscription, useQuery, useLazyQuery,
} from '@apollo/client';
import { useStores } from 'hooks/useStores';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQueryParam, NumberParam, StringParam } from 'use-query-params';
import passwordHashCreator from 'lib/utils/passwordHashCreator';
import { observer } from 'mobx-react';
import subscriptionTest from 'graphql/subscriptionTest';
import me from 'graphql/me';
import signInMutation from './graphql/signIn';
import joinMeetingMutation from './graphql/joinMeeting';
import Landing, { JoinMeetingInput, SignInInput } from './components/landing';

const LandingPage:React.FC = observer(() => {
  const [redirect, setRedirect] = useQueryParam('redirect', StringParam);
  const history = useHistory();
  const { authStore } = useStores();
  const [runSignInMutation] = useMutation(signInMutation, { fetchPolicy: 'no-cache' });
  const [runJoinMeetingMutation] = useMutation(joinMeetingMutation);
  const [runQuery, { called, data: meData }] = useLazyQuery(me);
  console.log(meData);
  const client = useApolloClient();

  const {
    variables, loading, data, error,
  } = useSubscription(subscriptionTest);

  console.log('data', data);

  useEffect(() => {
    if (authStore.isLoggedIn) {
      history.push(redirect ?? '/');
    }
  }, [authStore.isLoggedIn]);

  const onSignIn = (signInData: SignInInput): void => {
    const hashedPassword = passwordHashCreator(signInData.password);
    runSignInMutation({ variables: { input: { ...signInData, password: hashedPassword } } }).then((result) => {
      authStore.setToken(result.data.signIn.token);
      authStore.setViewer(result.data.signIn.user);
    }).catch((err) => {
      console.warn(err);
      console.log('Clearing token');
      authStore.logout();
    });

    runQuery();
  };

  const onJoinMeeting = (joinMeetingData: JoinMeetingInput): void => {
    runJoinMeetingMutation({ variables: joinMeetingData }).then((result) => {
      authStore.setToken(result.data.token);
      authStore.setViewer(result.data.signIn.user);
    });
  };

  return <Landing onSignIn={onSignIn} onJoinMeeting={onJoinMeeting} other={runQuery} />;
});

export default LandingPage;
