const {
  TRANSACTION_FETCH_DATATABLE,
  TRANSACTION_ALERT,
  TRANSACTION_FETCH_IN_HOUSE_DETAIL,
  TRANSACTION_FETCH_ITEMS,
  TRANSACTION_FETCH_DOCUMENT_LIST,
  TRANSACTION_FETCH_HOUSE_CALL_DETAIL
} = require('@constants/Transaction');

const initState = {
  dataTable: {
    totalItem: 0,
    totalFilteredItem: 0,
    items: []
  },
  inHouseDetail: {
    id: 0,
    soNumber: '',
    corporateCode: '',
    corporateName: '',
    qty: 0,
    discount: 0,
    serviceProductType: '',
    productId: 0,
    productName: '',
    productPrice: 0,
    priceListId: 0,
    serviceMethod: '',
    serviceGroup: '',
    transactionDate: '',
    notes: '',
    serviceType: '',
    statusValue: '',
    statusDesc: '',
    documentList: [
      {
        id: '',
        fileName: '',
        type: '',
        notes: ''
      }
    ]
  },
  houseCallDetail: undefined,
  items: undefined,
  documents: undefined,
  alert: {
    status: false,
    message: '',
    type: ''
  }
};

const transactionReducers = (state = initState, { type, payload }) => {
  switch (type) {
    case TRANSACTION_FETCH_DATATABLE:
      return { ...state, dataTable: payload };
    case TRANSACTION_FETCH_IN_HOUSE_DETAIL:
      return { ...state, inHouseDetail: payload };
    case TRANSACTION_FETCH_HOUSE_CALL_DETAIL:
      return { ...state, houseCallDetail: payload };
    case TRANSACTION_FETCH_ITEMS:
      return {
        ...state,
        items: payload,
        houseCallDetail: { ...state.houseCallDetail, items: payload },
        inHouseDetail: { ...state.inHouseDetail, items: payload }
      };
    case TRANSACTION_FETCH_DOCUMENT_LIST:
      return {
        ...state,
        documents: payload,
        houseCallDetail: { ...state.houseCallDetail, documents: payload },
        inHouseDetail: { ...state.inHouseDetail, documents: payload }
      };
    case TRANSACTION_ALERT:
      return { ...state, alert: payload };
    default:
      return state;
  }
};

export default transactionReducers;
