import React from 'react';
import SyncLoader from 'react-spinners/SyncLoader';
import { css } from '@emotion/react';

// TODO fix loading screen
const LoadingScreen: React.FC = () => (
  <div className="width-100vh flex-y-center flex-x-center flex-column">
    <div className="height-15p flex-space-around flex-column">
      <SyncLoader size={30} color="#275A9C" css={css``} />
      <div className="text-center h2 b">Now Loading....</div>
    </div>
  </div>
);

export default LoadingScreen;
