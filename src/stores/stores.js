import React from 'react';
import { useLocalStore } from 'mobx-react'; // 6.x or mobx-react-lite@1.4.0
import UserStore from './UserStore';

export const storeContext = React.createContext(null);

export const StoreProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    userStore: new UserStore(),
  }));
  return <storeContext.Provider value={store}>{children}</storeContext.Provider>;
};
