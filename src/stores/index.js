import React from 'react';
import userStore from './UserStore';

export const StoreContext = React.createContext({
  userStore,
});

export const useStores = () => React.useContext(StoreContext);
