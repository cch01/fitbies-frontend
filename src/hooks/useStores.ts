import React from 'react';
import stores from 'lib/stores/index';

export const useStores = () => React.useContext(stores);
