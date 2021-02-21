import React, { useEffect } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import LoadingScreen from 'components/loadingScreen';
import activateAccountGQL from './graphql/activateAccount';
import Activation from './components/activation';

interface MatchParams {
  token?: string;
}

export interface ActivationPageProps extends RouteComponentProps<MatchParams> {

}

const ActivationPage: React.FC<ActivationPageProps> = ({ match }) => {
  const history = useHistory();
  const { token } = match.params;
  const [activateAccount, { loading, data }] = useMutation(
    activateAccountGQL,
    {
      variables: { token },
      onCompleted: (data) => { toast.success('Activation succeeded'); },
      onError: (err) => {
        console.log('error', err);
        toast.error('Invalid token');
        history.replace('/landing');
      },
    },
  );
  if (!token) {
    history.replace('/landing');
  }

  useEffect(() => {
    activateAccount();
  }, []);

  if (loading || !data) return <LoadingScreen />;

  return <Activation onBackHome={() => history.replace('/landing')} />;
};

export default ActivationPage;
