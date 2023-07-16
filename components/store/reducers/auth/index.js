const {
  AUTH_LOGIN,
  AUTH_LOGIN_ERROR,
  AUTH_LOGIN_STATUS,
  AUTH_LOGOUT,
  AUTH_CURRENT_LOGIN_USER
} = require('components/constants/Authentication');
const { getItemLocalStorage } = require('components/utils/localstorage');

const initState = {
  login: getItemLocalStorage('AUTH')
    ? JSON.parse(getItemLocalStorage('AUTH'))
    : null,
  currentLoginUser: null,
  authError: false,
  authStatus: false
};

const authReducers = (state = initState, { type, payload }) => {
  switch (type) {
    case AUTH_LOGIN:
      return { ...state, login: payload };
    case AUTH_LOGIN_ERROR:
      return { ...state, authError: payload };
    case AUTH_LOGIN_STATUS:
      return { ...state, authStatus: payload };
    case AUTH_LOGOUT:
      return {
        ...state,
        login: null,
        currentLoginUser: undefined,
        authError: false,
        authStatus: false
      };
    case AUTH_CURRENT_LOGIN_USER:
      return { ...state, currentLoginUser: payload };

    default:
      return state;
  }
};

export default authReducers;
