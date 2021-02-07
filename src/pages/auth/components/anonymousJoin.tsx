import { Button, Grid, Link } from '@material-ui/core';
import clsx from 'clsx';
import SingleLineFormField from 'components/forms/SingleLineFormField';
import { FormApi } from 'final-form';
import React from 'react';

interface AnonymousJoinFormProps {
  handleAnonymousSignUpSubmit: (event?: React.SyntheticEvent<HTMLFormElement, Event> | undefined) => Promise<object | undefined> | undefined;
  form: FormApi<AnonymousSignUpInput, Partial<AnonymousSignUpInput>>
  toggleSignUpForm(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
  toggleFullSignUpForm(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
  className: any
}
export interface AnonymousSignUpInput {
  nickname: string;
}

const AnonymousJoinForm: React.FC<AnonymousJoinFormProps> = ({
  handleAnonymousSignUpSubmit, form, className, toggleSignUpForm, toggleFullSignUpForm,
}) => (
  <div className={className}>
    <form onSubmit={handleAnonymousSignUpSubmit}>
      <SingleLineFormField
        form={form}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Nickname"
        name="nickname"
        autoFocus
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        Continue
      </Button>
    </form>
    <div className="fullwidth">
      <Grid container justify="space-between">
        <Grid item className="pointer">
          <Link variant="body2" onClick={toggleFullSignUpForm}>
            Register as full member
          </Link>
        </Grid>
        <Grid item className="pointer">
          <Link variant="body2" onClick={toggleSignUpForm}>
            Back to login
          </Link>
        </Grid>
      </Grid>
    </div>
  </div>
);
export default AnonymousJoinForm;
