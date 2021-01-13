import { useStores } from 'hooks/useStores';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

interface TestProps {
  test?: string
}

const Test:React.FC<TestProps> = ({ test }) => {
  const { authStore } = useStores();
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    if (!authStore.isLoggedIn) {
      history.push({
        pathname: '/landing',
        search: `?redirect=${encodeURIComponent(location.pathname + location.search)}`,
      });
    }
  }, [authStore.isLoggedIn]);
  return (
    <div>
      HIHI,
      {test}
    </div>
  );
};

export default Test;
