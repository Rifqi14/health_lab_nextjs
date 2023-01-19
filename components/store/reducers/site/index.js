const { SITE_FETCH_SELECT_LIST, SITE_ALERT } = require('@constants/Site');

const initState = {
  selectList: [],
  alert: {
    status: false,
    message: '',
    type: ''
  }
};

const siteReducers = (state = initState, { type, payload }) => {
  switch (type) {
    case SITE_FETCH_SELECT_LIST:
      return { ...state, selectList: payload };
    case SITE_ALERT:
      return { ...state, alert: payload };

    default:
      return state;
  }
};

export default siteReducers;