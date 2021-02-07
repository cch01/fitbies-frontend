import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from 'react-final-form-hooks';
import clsx from 'clsx';
import { useState } from 'react';
import validator, { isEmail, isRequired, isSameAs } from 'lib/utils/validator';
import SignInForm, { SignInInput } from './signInForm';
import AnonymousJoinForm, { AnonymousSignUpInput } from './anonymousJoin';
import SignUpForm, { SignUpInput } from './signUpForm';

interface AuthPageProps {
  onSignIn(input: SignInInput): any;
  onAnonymousSignUp(input: AnonymousSignUpInput): any;
  onSignUp(input: SignUpInput): any;
  isHosting: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Auth:React.FC<AuthPageProps> = ({
  onSignIn, onAnonymousSignUp, onSignUp, isHosting,
}) => {
  const classes = useStyles();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isFullSignUp, setIsFullSignUp] = useState<boolean>(isHosting);
  const toggleSignUpForm = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setIsSignUp((val) => !val);
  };
  const toggleFullSignUpForm = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setIsFullSignUp((val) => !val);
  };

  const { form: signInForm, handleSubmit: handleSignInSubmit, submitting: signInSubmitting } = useForm({
    onSubmit: onSignIn,
  });

  const {
    form: anonymousSignUpForm,
    handleSubmit: handleAnonymousSignUpSubmit,
    submitting: anonymousSignUpSubmitting,
  } = useForm({
    onSubmit: onAnonymousSignUp,
    validate: (data) => validator(data, {
      nickname: [isRequired('Nickname is required.')],
    }),
  });

  const {
    form: signUpForm,
    handleSubmit: handleSignUpSubmit,
    submitting: signUpSubmitting,
  } = useForm({
    onSubmit: onSignUp,
    validate: (data) => validator(data, {
      email: [isRequired('Email is required.'), isEmail('Email is not valid.')],
      password: [isRequired('Password is required.')],
      confirmPassword: [isRequired('Confirm Password is required.'), isSameAs(data.password, 'This value should be same as password.')],
      nickname: [isRequired('Nickname is required.')],
      firstName: [isRequired('First Name is required.')],
      lastName: [isRequired('Last Name is required.')],
    }),
  });
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
            className={clsx('fullwidth', { hide: isFullSignUp || isHosting })}
            toggleFullSignUpForm={toggleFullSignUpForm}
            form={anonymousSignUpForm}
            handleAnonymousSignUpSubmit={handleAnonymousSignUpSubmit}
            toggleSignUpForm={toggleSignUpForm}
          />
          <SignUpForm
            className={clsx('fullwidth', { hide: !isFullSignUp })}
            toggleAnonymousJoin={toggleFullSignUpForm}
            form={signUpForm}
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
