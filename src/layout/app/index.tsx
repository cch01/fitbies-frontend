import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useStores } from 'hooks/useStores';
import { observer } from 'mobx-react-lite';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './index.module.scss';

const Layout:React.FC<{ children: React.ReactNode}> = observer(({ children }) => {
  const { uiStore: { title }, authStore } = useStores();
  const history = useHistory();
  const location = useLocation();
  // useEffect(() => {
  console.log(location);
  if (!authStore.isLoggedIn) {
    history.push({
      pathname: '/login',
      search: location.search === '/' ? '' : `?redirect=${encodeURIComponent(location.pathname + location.search)}`,
    });
  }
  // });

  return (
    <>
      <Helmet>
        <title>
          { title ? `${title} - ZOOMED` : 'ZOOMED' }
        </title>
      </Helmet>
      <div className={styles.background}>
        <div className={styles.mainContainer}>
          {children}
        </div>
      </div>
    </>
  );
});

export default Layout;
