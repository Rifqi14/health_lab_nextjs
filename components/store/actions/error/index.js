import { ERROR_DIALOG } from 'components/constants/ErrorConst';

export const errorMessage = module => {
  return async dispatch => {
    dispatch({
      type: ERROR_DIALOG,
      payload: { module: module, isOpen: true, errorMessage: undefined }
    });
  };
};

export const clearError = () => {
  return async dispatch => {
    dispatch({
      type: ERROR_DIALOG,
      payload: { module: undefined, isOpen: false, errorMessage: undefined }
    });
  };
};
