import { requestGet, requestPost } from '@config';
import {
  AUTH_CURRENT_LOGIN_USER,
  AUTH_LOGIN,
  AUTH_LOGIN_ERROR,
  AUTH_LOGOUT
} from '@constants/Authentication';
import { setItemLocalStorage } from '@utils/localstorage';

const configUrl = {
  service: 'users',
  version: 'v1',
  prefix: 'api'
};

export const authLogin = params => {
  return async dispatch => {
    try {
      const url = `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/login`;

      const res = await requestPost(url, params);

      if (res.statusCode === 200) {
        setItemLocalStorage('AUTH', JSON.stringify(res.payload));
      }

      dispatch({
        type: AUTH_LOGIN,
        payload: res.payload
      });

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: AUTH_LOGIN_ERROR,
        payload: JSON.stringify(error.response.data.message)
      });
    }
  };
};

export const authlogout = () => {
  return async dispatch => {
    try {
      dispatch({
        type: AUTH_LOGOUT
      });
      return true;
    } catch (err) {
      console.log(err);
    }
  };
};

export const authCurrentUser = () => {
  return async dispatch => {
    try {
      const url = `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/me`;
      const res = await requestGet(url);

      dispatch({
        type: AUTH_CURRENT_LOGIN_USER,
        payload: res.payload
      });

      dispatch({
        type: 'ALLOWED_SIDEBAR',
        payload: res.payload.roleModules
      })

      return res;
    } catch (error) {
      console.log(error);
    }
  };
};
