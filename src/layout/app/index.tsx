import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useStores } from 'hooks/useStores';
import { observer } from 'mobx-react-lite';
import { useHistory, useLocation } from 'react-router-dom';
import '../mainLayout.scss';

const Layout:React.FC<{ children: React.ReactNode}> = observer(({ children }) => {
  const { uiStore: { title }, authStore } = useStores();
  const history = useHistory();
  const location = useLocation();
  if (!authStore.isLoggedIn) {
    history.replace({
      pathname: '/login',
      search: location.search === '/' ? '' : `?redirect=${encodeURIComponent(location.pathname + location.search)}`,
    });
  }

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
    </>
  );
});

export default Layout;
