import {
  useMutation, useApolloClient, useSubscription, useQuery, useLazyQuery,
} from '@apollo/client';
import { useStores } from 'hooks/useStores';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { NumberParam, StringParam, useQueryParams } from 'use-query-params';
import passwordHashCreator from 'lib/utils/passwordHashCreator';
import { observer } from 'mobx-react';
import { toast } from 'react-toastify';
import signInGQL from './graphql/signIn';
import signUpGQL from './graphql/signUp';
import anonymousSignUpGQL from './graphql/anonymousSignUp';
import Auth from './components/auth';
import { SignInInput } from './components/signInForm';
import { SignUpInput } from './components/signUpForm';
import { AnonymousSignUpInput } from './components/anonymousJoin';

const LoginPage:React.FC = observer(() => {
  const [{ redirect }, setRedirect] = useQueryParams({ redirect: StringParam });
  const history = useHistory();
  const { authStore } = useStores();
  const [runSignInMutation] = useMutation(signInGQL, { fetchPolicy: 'no-cache' });
  const [runSignUpMutation] = useMutation(signUpGQL, {
    fetchPolicy: 'no-cache',
    onCompleted: () => {
      toast.success('Sign up successfully.');
      history.replace(decodeURIComponent(redirect as string) ?? '/');
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message ?? 'Something went wrong.');
    },
  });
  const [runAnonymousMutation] = useMutation(anonymousSignUpGQL, {
    fetchPolicy: 'no-cache',
    onCompleted: () => { toast.success('Sign up successfully.'); },
    onError: (err) => { console.log(err); toast.error(err.message ?? 'Something went wrong.'); },
  });

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
      toast.error('Failed to login');
      console.warn(err);
      console.log('Clearing token');
      authStore.logout();
    });
  };

  const onSignUp = (signUpInput: SignUpInput): void => {
    const { confirmPassword, ...filteredInput } = signUpInput;
    runSignUpMutation({ variables: { input: filteredInput } });
  };

  const onAnonymousSignUp = ({ nickname }: AnonymousSignUpInput): void => {
    runAnonymousMutation({ variables: { anonymousSignUpInput: { nickname } } }).then((result) => {
      authStore.setViewer(result.data.anonymousSignUp);
      history.replace(decodeURIComponent(redirect as string) ?? '/');
    });
  };

  return (
    <Auth
      isHosting={redirect === '/host'}
      onSignIn={onSignIn}
      onAnonymousSignUp={onAnonymousSignUp}
      onSignUp={onSignUp}
    />
  );
});

export default LoginPage;
