import { getItemLocalStorage } from './localstorage';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';

export const interceptorRequestConfig = config => {
  const { url } = config;
  const auth = getItemLocalStorage('AUTH');

  if (url) {
    if (!url.includes('/login')) {
      const credential = JSON.parse(auth);
      config.headers['Authorization'] = `Bearer ${credential.token}`;
      config.headers['RequestId'] = uuidv4();
      config.headers['Accept'] =
        'application/json, application/xml, text/plain, text/html, *.*';
    }
  }
  return config;
};

export const interceptorResponseErr = error => {
  // error?.response?.data?.message
  //   ? alert(error?.response?.data?.message)
  //   : alert(error.message);
  return Promise.reject(error);
};
