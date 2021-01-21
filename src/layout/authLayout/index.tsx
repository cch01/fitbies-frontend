import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useStores } from 'hooks/useStores';
import { observer } from 'mobx-react-lite';
import styles from './index.module.scss';

const AuthLayout:React.FC<{ children: React.ReactNode}> = observer(({ children }) => {
  const { uiStore: { title }, authStore } = useStores();

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

export default AuthLayout;
