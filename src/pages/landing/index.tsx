import { useStores } from 'hooks/useStores';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

// TODO: fix shadow problem, split class to class module
const LandingPage: React.FC = observer(() => {
  const history = useHistory();
  const { authStore } = useStores();
  const onClickHost:any = () => history.push('/auth');
  const onClickJoin:any = () => {
    authStore.isLoggedIn ? history.push('/join') : history.push({ pathname: '/login', search: '?redirect=join' });
  };
  return (
    <div className="flex-column">
      <div className="h1 text-center flex-column flex-x-center flex-y-center flex-1">Welcome to ZOOMED</div>
      <div className="flex-8 pt-6 width-100p height-100p flex-row flex-x-center flex-y-center flex-space-around">
        <div tabIndex={0} role="button" onMouseUp={onClickHost} className="pointer border-radius border width-250 height-250 hoverShadow flex-row flex-x-center flex-y-center">Host a meeting</div>
        <div tabIndex={0} role="button" onMouseUp={onClickJoin} className="pointer border-radius border width-250 height-250 hoverShadow flex-row flex-x-center flex-y-center">Join a meeting</div>
      </div>
    </div>
  );
});

export default LandingPage;
