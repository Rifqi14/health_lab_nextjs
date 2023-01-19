import { ERROR_DIALOG } from '@constants/ErrorConst';

const initState = {
  error: {
    module: '',
    errorMessage: '',
    isOpen: false
  }
};

const errorReducers = (state = initState, { type, payload }) => {
  switch (type) {
    case ERROR_DIALOG:
      return { ...state, error: payload };

    default:
      return state;
  }
};

export default errorReducers;
