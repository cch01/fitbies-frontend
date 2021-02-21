import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useStores } from 'hooks/useStores';
import RegisteredAccount from './components/registeredAccount';

interface RegisteredAccountPageState {
  email?: string
  viewerData?: any
}

const RegisteredAccountPage: React.FC = () => {
  const { authStore } = useStores();
  const location = useLocation<RegisteredAccountPageState>();
  const history = useHistory();
  const email = location.state?.email;
  const viewerData = location.state?.viewerData;
  if (!email || !viewerData) { history.replace('/'); }
  return (
    <RegisteredAccount
      email={email}
      onBackHome={() => {
        authStore.setViewer(viewerData);
      }}
    />
  );
};

export default RegisteredAccountPage;
