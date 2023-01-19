const {
  CORPORATE_TRX_FETCH_DATATABLE,
  CORPORATE_TRX_ALERT,
  CORPORATE_TRX_FETCH_DETAIL
} = require('@constants/CorporateTransaction');

const initState = {
  webRegInitialValue: {
    corporateCode: '',
    productId: 0,
    productName: '',
    productPrice: 0,
    qty: 0,
    discount: 0,
    serviceMethod: '',
    transactionDate: '',
    description: '',
    groupType: ''
  },
  dataTable: {
    totalItem: 0,
    totalFilteredItem: 0,
    items: []
  },
  detail: null,
  alert: {
    status: false,
    message: '',
    type: ''
  }
};

const corporateTrx = (state = initState, { type, payload }) => {
  switch (type) {
    case CORPORATE_TRX_FETCH_DATATABLE:
      return { ...state, dataTable: payload };
    case CORPORATE_TRX_FETCH_DETAIL:
      return { ...state, detail: payload };
    case CORPORATE_TRX_ALERT:
      return { ...state, alert: payload };

    default:
      return state;
  }
};

export default corporateTrx;
