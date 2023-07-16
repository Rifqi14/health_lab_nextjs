const {
  PRODUCT_FETCH_COVID_SELECT_LIST,
  PRODUCT_FETCH_MCU_SELECT_LIST,
  PRODUCT_FETCH_SELECT_LIST,
  PRODUCT_ALERT,
  PRODUCT_FETCH_TIER_SELECT_LIST
} = require('components/constants/Product');

const initState = {
  selectList: [],
  covidSelectList: [],
  mcuSelectList: [],
  tierSelectList: [],
  alert: {
    status: false,
    message: '',
    type: ''
  }
};

const productReducers = (state = initState, { type, payload }) => {
  switch (type) {
    case PRODUCT_FETCH_COVID_SELECT_LIST:
      return { ...state, covidSelectList: payload };
    case PRODUCT_FETCH_MCU_SELECT_LIST:
      return { ...state, mcuSelectList: payload };
    case PRODUCT_FETCH_SELECT_LIST:
      return { ...state, selectList: payload };
    case PRODUCT_ALERT:
      return { ...state, alert: payload };
    case PRODUCT_FETCH_TIER_SELECT_LIST:
      return { ...state, tierSelectList: payload };

    default:
      return state;
  }
};

export default productReducers;
