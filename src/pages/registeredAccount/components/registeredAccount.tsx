import { Button } from '@material-ui/core';
import React from 'react';

export interface RegisteredAccountProps {
  email?: string;
  onBackHome(): void
}

const RegisteredAccount: React.FC<RegisteredAccountProps> = ({ onBackHome, email }) => (
  <div className="height-100p flex-column flex-y-center flex-space-around p3">
    <div className="text-center text-middle ">
      <div className="h1">
        Thank you for using our service!
        <i className="fas fa-grin-squint-tears pl-2" />
      </div>
      <div className="h3 pt-4 max-width-350 inline-block"> To host a meeting, please check your email to activate your account.</div>
    </div>
    <div className="width-80p">
      <Button
        onClick={onBackHome}
        type="button"
        fullWidth
        variant="contained"
        color="primary"
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        Continue
      </Button>
    </div>
  </div>
);
export default RegisteredAccount;
