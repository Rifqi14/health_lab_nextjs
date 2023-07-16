import { wrapper } from 'components/store';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Provider, useDispatch, useStore } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import '../styles/404.css';
import '../styles/globals.css';
import { CHANGE_SIDEBAR_MODE } from 'components/constants/Sidebar';

function MyApp({ Component, pageProps }) {
  const store = useStore(state => state);
  const dispatch = useDispatch();
  const router = useRouter();

  const state = store.getState();
  const { sidebar, auth, role } = state;

  // useEffect(() => {
  //   if (
  //     !auth.login &&
  //     !router.route.includes('verify') &&
  //     !router.route.includes('input-otp') &&
  //     !router.route.includes('reset-password') &&
  //     !router.route.includes('forgot-password')
  //   ) {
  //     router.replace('/login');
  //   }

  //   if (auth.login) {
  //     if (router.route.includes('/login')) {
  //       router.replace('/');
  //     }
  //   }
  // }, [auth]);

  useEffect(() => {
    if (window.screen.width <= 1366) {
      dispatch({ type: CHANGE_SIDEBAR_MODE, payload: false });
    } else {
      dispatch({ type: CHANGE_SIDEBAR_MODE, payload: true });
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={store.__persistor} loading={null}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
