const {
  LAB_PARTNER_FETCH_DATATABLE,
  LAB_PARTNER_FETCH_DETAIL,
  LAB_PARTNER_ALERT,
  LAB_PARTNER_CREATE,
  LAB_PARTNER_UPDATE,
  LAB_SELECT_LIST,
  LAB_PARTNER_FETCH_SELECT_LIST
} = require('components/constants/LapPartner');

const initState = {
  postInitialValue: {
    code: '',
    name: '',
    address: '',
    phoneNumber: '',
    pic: '',
    labInCharge: '',
    bumameInCharge: '',
    priceQuoteList: '',
    labId: 0,
    cooperationTermCode: '',
    npwp: ''
  },
  editInitialValue: {
    name: '',
    address: '',
    phoneNumber: '',
    pic: '',
    labInCharge: '',
    bumameInCharge: '',
    priceQuoteList: '',
    labId: 0,
    cooperationTermCode: '',
    npwp: ''
  },
  dataTable: {
    totalItem: 0,
    totalFilteredItem: 0,
    items: []
  },
  labPartnerDetail: {
    statusData: '',
    createdBy: '',
    createdDt: '',
    updatedBy: '',
    updatedDt: '',
    code: '',
    name: '',
    address: '',
    phoneNumber: '',
    pic: '',
    labInCharge: '',
    bumameInCharge: '',
    priceQuoteList: '',
    lab: {
      createdBy: '',
      createdByName: '',
      createdByRoleName: '',
      createdByDesc: '',
      createdDt: '',
      statusData: '',
      updatedBy: '',
      updatedByName: '',
      updatedByRoleName: '',
      updatedByDesc: '',
      updatedDt: '',
      deletedDt: '',
      id: 0,
      code: '',
      name: '',
      address: '',
      description: ''
    },
    cooperationTerm: {
      createdBy: '',
      createdByName: '',
      createdByRoleName: '',
      createdByDesc: '',
      createdDt: '',
      statusData: '',
      updatedBy: '',
      updatedByName: '',
      updatedByRoleName: '',
      updatedByDesc: '',
      updatedDt: '',
      deletedDt: '',
      code: '',
      name: '',
      description: ''
    }
  },
  selectList: [],
  labSelectList: [],
  alert: {
    status: false,
    message: '',
    type: ''
  }
};

const labPartnerReducers = (state = initState, { type, payload }) => {
  switch (type) {
    case LAB_PARTNER_FETCH_DATATABLE:
      return { ...state, dataTable: payload };
    case LAB_PARTNER_FETCH_SELECT_LIST:
      return { ...state, selectList: payload };
    case LAB_PARTNER_FETCH_DETAIL:
      return { ...state, labPartnerDetail: payload };
    case LAB_PARTNER_ALERT:
      return { ...state, alert: payload };
    case LAB_PARTNER_CREATE:
      return {
        ...state,
        postInitialValue: {
          code: '',
          name: '',
          address: '',
          phoneNumber: '',
          pic: '',
          labInCharge: '',
          bumameInCharge: '',
          priceQuoteList: '',
          labId: 0,
          cooperationTermCode: ''
        }
      };
    case LAB_PARTNER_UPDATE:
      return {
        ...state,
        editInitialValue: {
          name: payload.name,
          address: payload.address,
          phoneNumber: payload.phoneNumber,
          pic: payload.pic,
          saleRepresentative: '',
          labId: 0,
          cooperationTermCode: ''
        }
      };
    case LAB_SELECT_LIST:
      return {
        ...state,
        labSelectList: payload
      };

    default:
      return state;
  }
};

export default labPartnerReducers;
