import { Button, Grid, Link } from '@material-ui/core';
import clsx from 'clsx';
import SingleLineFormField from 'components/forms/SingleLineFormField';
import { FormApi } from 'final-form';
import React from 'react';

export interface SignUpInput {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  firstName: string;
  lastName: string;
}

interface SignUpFormProps {
  handleSignUpSubmit: (event?: React.SyntheticEvent<HTMLFormElement, Event> | undefined) => Promise<object | undefined> | undefined;
  form: FormApi<SignUpInput, Partial<SignUpInput>>;
  toggleSignUpForm(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
  toggleAnonymousJoin(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
  isHosting: boolean;
  className: any;
}

const SignUpForm:React.FC<SignUpFormProps> = ({
  handleSignUpSubmit, form, className, toggleSignUpForm, toggleAnonymousJoin, isHosting,
}) => (
  <div className={className}>
    <form onSubmit={handleSignUpSubmit}>
      <SingleLineFormField
        form={form}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="First Name"
        name="firstName"
        autoFocus
      />
      <SingleLineFormField
        form={form}
        variant="outlined"
        margin="normal"
        fullWidth
        required
        name="lastName"
        label="Last Name"
      />
      <SingleLineFormField
        form={form}
        variant="outlined"
        margin="normal"
        fullWidth
        required
        name="email"
        label="Email"
        type="email"
      />
      <SingleLineFormField
        form={form}
        variant="outlined"
        margin="normal"
        fullWidth
        required
        name="nickname"
        label="Nickname"
      />
      <SingleLineFormField
        form={form}
        variant="outlined"
        margin="normal"
        fullWidth
        required
        type="password"
        name="password"
        label="Password"
      />
      <SingleLineFormField
        form={form}
        variant="outlined"
        margin="normal"
        fullWidth
        required
        type="password"
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
        Sign Up
      </Button>
    </form>
    <div className="fullwidth">
      <Grid container justify="space-between">
        <Grid item className={clsx({ hide: isHosting })}>
          <Link variant="body2" onClick={toggleAnonymousJoin}>
            Quick join with your nickname
          </Link>
        </Grid>
        <Grid item className={clsx('text-right', 'pointer', { fullwidth: isHosting })}>
          <Link variant="body2" onClick={toggleSignUpForm}>
            Back to login
          </Link>
        </Grid>
      </Grid>
    </div>
  </div>
);

export default SignUpForm;
