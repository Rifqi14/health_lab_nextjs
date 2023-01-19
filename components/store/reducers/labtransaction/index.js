import {
  LAB_TRANSACTION_ALERT,
  LAB_TRANSACTION_CREATE,
  LAB_TRANSACTION_FETCH_DATATABLE,
  LAB_TRANSACTION_FETCH_DETAIL
} from '@constants/LabTransaction';

const initState = {
  formInitialValue: null,
  detail: null,
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

const labTransactionReducers = (state = initState, { type, payload }) => {
  switch (type) {
    case LAB_TRANSACTION_FETCH_DATATABLE:
      return { ...state, dataTable: payload };
    case LAB_TRANSACTION_FETCH_DETAIL:
      return { ...state, detail: payload };
    case LAB_TRANSACTION_ALERT:
      return { ...state, alert: payload };
    case LAB_TRANSACTION_CREATE:
      return { ...state, formInitialValue: null };

    default:
      return state;
  }
};

export default labTransactionReducers;
