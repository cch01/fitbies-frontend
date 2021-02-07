import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import SingleLineFormField from 'components/forms/SingleLineFormField';
import { useForm } from 'react-final-form-hooks';
import clsx from 'clsx';
import { useState } from 'react';
import { useQueryParam } from 'use-query-params/lib/useQueryParam';
import { StringParam } from 'use-query-params';
import SignInForm from './signInForm';
import AnonymousJoinForm from './anonymousJoin';
import SignUpForm from './signUpForm';

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  firstName: string;
  lastName: string;
}

interface LoginPageProps {
  onSignIn(input: SignInInput): any;
  onAnonymousSignUp(input: {nickname: string}): any;
  onSignUp(input: SignUpInput): any;
  isHosting: boolean;
}
const Copyright: React.FC = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {'Copyright © '}
    <Link color="inherit" href="https://material-ui.com/">
      Your Website
    </Link>
    {new Date().getFullYear()}
    .
  </Typography>
);

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

// TODO: split forms to components
const Auth:React.FC<LoginPageProps> = ({
  onSignIn, onAnonymousSignUp, onSignUp, isHosting,
}) => {
  const classes = useStyles();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isFullSignUp, setIsFullSignUp] = useState<boolean>(false);
  const toggleSignUpForm = () => { setIsSignUp((val) => !val); };
  const toggleFullSignUpForm = () => { setIsFullSignUp((val) => !val); };
  const { form: signInForm, handleSubmit: handleSignInSubmit, submitting: signInSubmitting } = useForm({ onSubmit: onSignIn });
  const { form: anonymousSignUpForm, handleSubmit: handleAnonymousSignUpSubmit, submitting: anonymousSignUpSubmitting } = useForm({ onSubmit: onAnonymousSignUp });
  const { form: signUpForm, handleSubmit: handleSignUpSubmit, submitting: signUpSubmitting } = useForm({ onSubmit: onSignUp });
  return (
    <Container component="main" maxWidth="xs">
      <div className="flex-column flex-y-center mt-8">
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <div className="h1 mb-1">
          Welcome to ZOOMED
        </div>
        <SignInForm
          className={clsx({ hide: isSignUp })}
          form={signInForm}
          handleSignInSubmit={handleSignInSubmit}
          toggleSignUpForm={toggleSignUpForm}
        />
        <div className={clsx({ hide: !isSignUp })}>
          <AnonymousJoinForm
            className={clsx('fullwidth', { hide: !isFullSignUp || isHosting })}
            toggleFullSignUpForm={toggleFullSignUpForm}
            form={anonymousSignUpForm}
            handleAnonymousSignUpSubmit={handleAnonymousSignUpSubmit}
            toggleSignUpForm={toggleSignUpForm}
          />
          <SignUpForm
            className={clsx('fullwidth', { hide: isFullSignUp || !isHosting })}
            toggleAnonymousJoin={toggleFullSignUpForm}
            form={anonymousSignUpForm}
            handleSignUpSubmit={handleSignUpSubmit}
            toggleSignUpForm={toggleSignUpForm}
            isHosting={isHosting}
          />
        </div>
      </div>
    </Container>
  );
};

export default Auth;
