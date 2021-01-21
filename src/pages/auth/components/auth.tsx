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

export interface JoinMeetingInput {
  joinerId: string;
  meetingId: string;
}

interface LoginPageProps {
  onSignIn(input: SignInInput): any;
  onJoinMeeting(input: JoinMeetingInput): any;
  other(): any
}
const Copyright: React.FC = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {'Copyright © '}
    <Link color="inherit" href="https://material-ui.com/">
      Your Website
    </Link>
    {' '}
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

const Auth:React.FC<LoginPageProps> = ({ other, onSignIn, onJoinMeeting }) => {
  const classes = useStyles();
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const { form: signInForm, handleSubmit: handleSignInSubmit, submitting: signInSubmitting } = useForm({ onSubmit: onSignIn });
  const { form: joinMeetingForm, handleSubmit: handleJoinMeetingSubmit, submitting: joinMeetingSubmitting } = useForm({ onSubmit: onJoinMeeting });
  return (
    <Container component="main" maxWidth="xs">
      <div className="flex-column flex-y-center mt-8">
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <div className="h1 mb-1">
          Welcome to ZOOMED
        </div>
        <form className={clsx({ hide: isJoining })} noValidate onSubmit={handleSignInSubmit}>
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
        </form>
        <form className={clsx({ hide: !isJoining })} noValidate onSubmit={handleJoinMeetingSubmit}>
          <SingleLineFormField
            form={joinMeetingForm}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Room ID"
            name="roomId"
            autoFocus
          />
          <SingleLineFormField
            form={joinMeetingForm}
            variant="outlined"
            margin="normal"
            fullWidth
            name="passCode"
            label="Pass Code (if any)"
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
        <Grid container className="hoverShadow transition">
          <Grid item xs>
            <Link href="#" variant="body2" onClick={other}>
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2" onClick={() => setIsJoining((val) => !val)}>
              Join a meeting
            </Link>
          </Grid>
        </Grid>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Auth;
