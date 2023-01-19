import { LAB_PARTNER_ALERT } from '@constants/LapPartner';

const { COOPERATION_TERM_SELECT_LIST } = require('@constants/CooperationTerm');

const initState = {
  cooperationTermSelectList: [],
  alert: {
    status: false,
    message: '',
    type: ''
  }
};

const cooperationTermReducers = (state = initState, { type, payload }) => {
  switch (type) {
    case COOPERATION_TERM_SELECT_LIST:
      return { ...state, cooperationTermSelectList: payload };
    case LAB_PARTNER_ALERT:
      return { ...state, alert: payload };

    default:
      return state;
  }
};

export default cooperationTermReducers;
