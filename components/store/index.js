import rootReducer from 'components/store/reducers';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import storage from './sync_storage';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
// import { configureStore } from '@reduxjs/toolkit';

const bindMiddleware = middleware => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const configureAppStore = () => {
  const { persistStore, persistReducer } = require('redux-persist');

  const persistConfig = {
    key: 'nextjs',
    storage,
    blacklist: ['navigation']
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, bindMiddleware([thunk]));
  store.__persistor = persistStore(store); // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature

  return store;
};

export const wrapper = createWrapper(configureAppStore);
