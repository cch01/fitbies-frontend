import clsx from 'clsx';
import { useStores } from 'hooks/useStores';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './index.module.scss';

const LandingPage: React.FC = observer(() => {
  const history = useHistory();
  const { authStore } = useStores();
  const onClickHost:any = () => {
    history.push('/host');
  };
  const onClickJoin:any = () => {
    history.push('/join');
  };
  return (
    <div className="flex-column">
      <div className={styles.title}>Welcome to ZOOMED</div>
      <div className={styles.tileContainer}>
        <div tabIndex={0} role="button" onMouseUp={onClickHost} className={clsx('mr-2', styles.tile)}>Host a meeting</div>
        <div tabIndex={0} role="button" onMouseUp={onClickJoin} className={clsx('ml-2', styles.tile)}>Join a meeting</div>
      </div>
    </div>
  );
});

export default LandingPage;
