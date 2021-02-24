import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useStores } from 'hooks/useStores';
import { observer } from 'mobx-react-lite';
import '../mainLayout.scss';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';

const AuthLayout:React.FC<{ children: React.ReactNode}> = observer(({ children }) => {
  const { uiStore: { title }, authStore } = useStores();
  const history = useHistory();
  const onLogout = () => {
    authStore.logout();
    _.isEmpty(authStore.token) && toast.success('You have logged out');
    history.replace('/');
  };
  return (
    <>
      <Helmet>
        <title>
          { title ? `${title} - ZOOMED` : 'ZOOMED' }
        </title>
      </Helmet>
      <div className="background">
        <div className="mainContainer">
          {children}
        </div>
      </div>
      <div
        role="button"
        tabIndex={0}
        onMouseUp={onLogout}
        className={clsx({ hide: _.isEmpty(authStore.token) },
          'hoverShadow pointer position-absolute top right mr-2 mt-2 p2 border-radius bg-light-green pale-green')}
      >
        <i className="fas fa-sign-out-alt mr-1" />
        Logout
      </div>
    </>
  );
});

export default AuthLayout;
