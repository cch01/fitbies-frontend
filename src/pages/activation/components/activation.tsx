import { Button } from '@material-ui/core';
import React from 'react';

interface ActivationProps {
  onBackHome(): void
}

const Activation: React.FC<ActivationProps> = ({ onBackHome }) => (
  <div className="height-100p flex-column flex-y-center flex-space-around p3">
    <div className="text-center text-middle">
      <div className="h1">
        Congratulations
        <i className="fas fa-glass-cheers pl-2" />
      </div>
      <div className="h3 pt-4"> You have activated your account!</div>
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
        Back to login
      </Button>
    </div>
  </div>
);

export default Activation;
