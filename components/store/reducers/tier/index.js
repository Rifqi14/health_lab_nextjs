const { TIER_FETCH_SELECT_LIST, TIER_ALERT } = require('@constants/Tier');

const initState = {
  selectList: [],
  alert: {
    status: false,
    message: '',
    type: ''
  }
};

const tierReducers = (state = initState, { type, payload }) => {
  switch (type) {
    case TIER_FETCH_SELECT_LIST:
      return { ...state, selectList: payload };
    case TIER_ALERT:
      return { ...state, alert: payload };

    default:
      return state;
  }
};

export default tierReducers;
