import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useStores } from 'hooks/useStores';
import { observer } from 'mobx-react-lite';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './index.module.scss';

const MeetingLayout:React.FC<{ children: React.ReactNode}> = observer(({ children }) => {
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
      <div key="meeting-bg" className={styles.background}>
        <div key="meeting-container" className={styles.meetingContainer}>
          {children}
        </div>
      </div>
    </>
  );
});

export default MeetingLayout;
