import React from 'react';
import SyncLoader from 'react-spinners/SyncLoader';
import { css } from '@emotion/react';

// TODO fix loading screen
const LoadingScreen: React.FC<{width?: string}> = ({ width }) => (
  <div className="width-100p flex-y-center flex-x-center flex-column" style={{ width }}>
    <div className="height-15p flex-space-around flex-column flex-y-center flex-x-center">
      <SyncLoader size={25} color="#275A9C" />
      <div className="text-center h2 b">Now Loading....</div>
    </div>
  </div>
);

export default LoadingScreen;
