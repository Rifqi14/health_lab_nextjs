const {
  CORPORATE_FETCH_DATATABLE,
  CORPORATE_FETCH_SELECT_LIST,
  CORPORATE_ALERT,
  CORPORATE_FETCH_DETAIL
} = require('components/constants/Corporate');

const initState = {
  dataTable: {
    totalItem: 0,
    totalFilteredItem: 0,
    items: []
  },
  detail: undefined,
  selectList: [],
  alert: {
    status: false,
    message: '',
    type: ''
  }
};

const corporateReducers = (state = initState, { type, payload }) => {
  switch (type) {
    case CORPORATE_FETCH_DETAIL:
      return { ...state, detail: payload };
    case CORPORATE_FETCH_DATATABLE:
      return { ...state, dataTable: payload };
    case CORPORATE_FETCH_SELECT_LIST:
      return { ...state, selectList: payload };
    case CORPORATE_ALERT:
      return { ...state, alert: payload };

    default:
      return state;
  }
};

export default corporateReducers;
