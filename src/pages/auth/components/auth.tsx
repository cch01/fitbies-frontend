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
const Auth:React.FC<LoginPageProps> = ({ onSignIn, onAnonymousSignUp, onSignUp }) => {
  const classes = useStyles();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isFullSignUp, setIsFullSignUp] = useState<boolean>(false);
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
        <form className={clsx({ hide: isSignUp })} noValidate onSubmit={handleSignInSubmit}>
          <SingleLineFormField
            form={signInForm}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <SingleLineFormField
            form={signInForm}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: 20, marginBottom: 20 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2" onClick={() => setIsSignUp((val) => !val)}>
                Register
              </Link>
            </Grid>
          </Grid>
        </form>
        <div className={clsx({ hide: !isSignUp }, 'flex-column flex-y-center')}>
          <form noValidate onSubmit={handleAnonymousSignUpSubmit} className={clsx('fullwidth', { hide: isFullSignUp })}>
            <SingleLineFormField
              form={anonymousSignUpForm}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Nickname"
              name="nickName"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: 20, marginBottom: 20 }}
            >
              Join meeting
            </Button>
          </form>
          <form className={clsx({ hide: !isFullSignUp })} onSubmit={handleSignUpSubmit}>
            <SingleLineFormField
              form={signUpForm}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="First Name"
              name="firstName"
              autoFocus
            />
            <SingleLineFormField
              form={signUpForm}
              variant="outlined"
              margin="normal"
              fullWidth
              required
              name="lastName"
              label="Last Name"
            />
            <SingleLineFormField
              form={signUpForm}
              variant="outlined"
              margin="normal"
              fullWidth
              required
              name="email"
              label="Email"
            />
            <SingleLineFormField
              form={signUpForm}
              variant="outlined"
              margin="normal"
              fullWidth
              required
              name="nickname"
              label="Nickname"
            />
            <SingleLineFormField
              form={signUpForm}
              variant="outlined"
              margin="normal"
              fullWidth
              required
              name="password"
              label="Password"
            />
            <SingleLineFormField
              form={signUpForm}
              variant="outlined"
              margin="normal"
              fullWidth
              required
              name="confirmPassword"
              label="Confirm Password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: 20, marginBottom: 20 }}
            >
              Join meeting
            </Button>
          </form>
          <div className={clsx({ hide: !isSignUp }, 'fullwidth ')}>
            <Grid container justify="space-between">
              <Grid item>
                <Link variant="body2" onClick={() => setIsFullSignUp((val) => !val)}>
                  {isFullSignUp ? 'Join meeting without registration' : 'Register as full member'}
                </Link>
              </Grid>
              <Grid item>
                <Link variant="body2" onClick={() => setIsSignUp((val) => !val)}>
                  Back to login
                </Link>
              </Grid>
            </Grid>
          </div>
          <div className={clsx({ hide: isSignUp }, 'fullwidth')}>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={() => setIsSignUp((val) => !val)}>
                  Register
                </Link>
              </Grid>
            </Grid>
          </div>
        </div>

      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Auth;
