const {
  HOUSECALL_FETCH_DATATABLE,
  HOUSECALL_FETCH_TRANSACTION_ITEM,
  HOUSECALL_ALERT,
  HOUSECALL_FETCH_DETAIL
} = require('components/constants/Housecall');

const initState = {
  initialValue: {
    corporateCode: '',
    productId: 0,
    productName: '',
    productPrice: 0,
    qty: 0,
    discount: 0,
    serviceMethod: '',
    groupType: '',
    transactionDate: '',
    additionalCost: 0,
    description: '',
    picName: '',
    address: '',
    items: [
      {
        identityNumber: '',
        identityName: ''
      }
    ],
    schedule: {
      pic: '',
      bookingDate: '',
      timeStart: 0,
      timeEnd: 0
    }
  },
  transactionItem: undefined,
  detail: undefined,
  dataTable: {
    totalItem: 0,
    totalFilteredItem: 0,
    items: []
  },
  alert: {
    status: false,
    message: '',
    type: ''
  }
};

const housecallReducers = (state = initState, { type, payload }) => {
  switch (type) {
    case HOUSECALL_FETCH_DATATABLE:
      return { ...state, dataTable: payload };
    case HOUSECALL_FETCH_TRANSACTION_ITEM:
      return { ...state, transactionItem: payload };
    case HOUSECALL_FETCH_DETAIL:
      return { ...state, detail: payload };
    case HOUSECALL_ALERT:
      return { ...state, alert: payload };

    default:
      return state;
  }
};

export default housecallReducers;
