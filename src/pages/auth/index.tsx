import {
  useMutation, useApolloClient, useSubscription, useQuery, useLazyQuery,
} from '@apollo/client';
import { useStores } from 'hooks/useStores';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { NumberParam, StringParam, useQueryParams } from 'use-query-params';
import passwordHashCreator from 'lib/utils/passwordHashCreator';
import { observer } from 'mobx-react';
import signInMutation from './graphql/signIn';
import Auth, { SignUpInput, SignInInput } from './components/auth';

const LoginPage:React.FC = observer(() => {
  const [{ redirect }, setRedirect] = useQueryParams({ redirect: StringParam });
  const history = useHistory();
  const { authStore } = useStores();
  const [runSignInMutation] = useMutation(signInMutation, { fetchPolicy: 'no-cache' });
  // TODO add signup anonymousSignUp mutation
  useEffect(() => {
    if (authStore.isRegistered) {
      history.replace(decodeURIComponent(redirect as string) ?? '/');
    }
  }, [authStore.isRegistered]);

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
  };

  const onSignUp = (signUpInput: SignUpInput): void => {
    // TODO
  };

  const onAnonymousSignUp = (input: {nickname: string}): void => {
    // TODO
  };

  return <Auth isHosting={redirect === '/host'} onSignIn={onSignIn} onAnonymousSignUp={onAnonymousSignUp} onSignUp={onSignUp} />;
});

export default LoginPage;
