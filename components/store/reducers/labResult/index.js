const { LAB_CHECK_SAMPLECODE } = require('components/constants/LabResult');

const initState = {
  dataCektable: {
    items: []
  },
  alert: {
    status: false,
    message: '',
    type: ''
  }
};

const labResultReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case LAB_CHECK_SAMPLECODE:
      return { ...state, dataCektable: payload };

    default:
      return state;
  }
};

export default labResultReducer;
