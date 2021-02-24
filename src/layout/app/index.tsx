import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useStores } from 'hooks/useStores';
import { observer } from 'mobx-react-lite';
import { useHistory, useLocation } from 'react-router-dom';
import '../mainLayout.scss';
import { toast } from 'react-toastify';
import _ from 'lodash';
import clsx from 'clsx';

const Layout:React.FC<{ children: React.ReactNode}> = observer(({ children }) => {
  const { uiStore: { title }, authStore } = useStores();
  const history = useHistory();
  const location = useLocation();
  if (!authStore.isRegistered) {
    history.replace({
      pathname: '/login',
      search: location.search === '/' ? '' : `?redirect=${encodeURIComponent(location.pathname + location.search)}`,
    });
  }
  const onLogout = () => {
    authStore.logout();
    history.replace('/');
    _.isEmpty(authStore.token) && toast.success('You have logged out');
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
      {' '}

    </>
  );
});

export default Layout;
