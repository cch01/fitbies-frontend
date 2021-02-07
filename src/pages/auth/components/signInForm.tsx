import { Button, Grid, Link } from '@material-ui/core';
import SingleLineFormField from 'components/forms/SingleLineFormField';
import { FormApi } from 'final-form';
import React from 'react';
import { SignInInput } from './auth';

interface SignInFormProps {
  handleSignInSubmit: (event?: React.SyntheticEvent<HTMLFormElement, Event> | undefined) => Promise<object | undefined> | undefined;
  form: FormApi<SignInInput, Partial<SignInInput>>
  toggleSignUpForm(): void;
  className: any
}

const SignInForm: React.FC<SignInFormProps> = ({
  handleSignInSubmit, form, toggleSignUpForm, className,
}) => (
  <form noValidate onSubmit={handleSignInSubmit} className={className}>
    <SingleLineFormField
      form={form}
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
      form={form}
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
        <Link href="#" variant="body2" onClick={toggleSignUpForm}>
          Register
        </Link>
      </Grid>
    </Grid>
  </form>
);

export default SignInForm;
