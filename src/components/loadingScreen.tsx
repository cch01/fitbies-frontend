import React from 'react';
import SyncLoader from 'react-spinners/SyncLoader';
import { css } from '@emotion/react';

const LoadingScreen: React.FC = () => (
  <div className="width-100vh height-100vh flex-y-center flex-x-center flex-column">
    <div className="height-15p flex-space-around flex-column">
      <SyncLoader size={50} color="#275A9C" css={css``} />
      <div className="text-center h2 b">Now Loading....</div>
    </div>
  </div>
);

export default LoadingScreen;
