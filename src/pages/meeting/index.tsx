import { Paper } from '@material-ui/core';
import { useStores } from 'hooks/useStores';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

interface routeState {
  roomId: string;
}

const Test:React.FC = () => {
  const { authStore } = useStores();
  const history = useHistory();
  const location = useLocation<routeState>();
  if (_.isNil(location.state)) history.push('/landing');

  return (
    <div className="max-width">
      <Paper>
        HIHI,
      </Paper>
    </div>
  );
};

export default Test;
