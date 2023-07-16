import {
  requestGet,
  requestPost,
  requestPut,
  requestGetFile
} from 'components/config';
import {
  HOUSECALL_ALERT,
  HOUSECALL_FETCH_DATATABLE,
  HOUSECALL_FETCH_DETAIL,
  HOUSECALL_FETCH_TRANSACTION_ITEM
} from 'components/constants/Housecall';
import {
  TRANSACTION_ALERT,
  TRANSACTION_FETCH_HOUSE_CALL_DETAIL,
  TRANSACTION_FETCH_ITEMS
} from 'components/constants/Transaction';
import {
  fetchTransactionDocumentList,
  fetchTransactionItems
} from '../transaction';
const configUrl = {
  service: 'house-call',
  prefix: 'api'
};

export const fetchHouseCallDataTable = params => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.service}/datatable`,
        { ...params }
      );
      dispatch({
        type: HOUSECALL_FETCH_DATATABLE,
        payload: res.payload
      });

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: HOUSECALL_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const fetchHouseCallDetail = transactionId => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.service}/detail/${transactionId}`
      );
      if (res.isSuccess && res.statusCode == 200) {
        dispatch(fetchTransactionItems(transactionId));
        dispatch(fetchTransactionDocumentList(transactionId));
      }

      dispatch({
        type: HOUSECALL_FETCH_DETAIL,
        payload: res.payload
      });
      dispatch({
        type: TRANSACTION_FETCH_HOUSE_CALL_DETAIL,
        payload: res.payload
      });

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: HOUSECALL_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const fetchHouseCallItems = transactionId => {
  return async dispatch => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}/${configUrl.service}/${transactionId}/transaction-item`
      );

      dispatch({
        type: HOUSECALL_FETCH_TRANSACTION_ITEM,
        payload: res.payload
      });
      dispatch({
        type: TRANSACTION_FETCH_ITEMS,
        payload: res.payload
      });
      console.log(res);

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: HOUSECALL_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const createTransaction = body => {
  return async dispatch => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}/${configUrl.service}`,
        body
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: TRANSACTION_ALERT,
        payload: {
          status: true,
          message: error.response.data.message
            ? JSON.stringify(error.response?.data?.message)
            : JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const checkinItem = (itemId, data) => {
  return async dispatch => {
    try {
      const res = await requestPut(
        `${configUrl.prefix}/${configUrl.service}/${itemId}/checkin`,
        data
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: TRANSACTION_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
      return error;
    }
  };
};

export const collectedItem = (itemId, data) => {
  return async dispatch => {
    try {
      const res = await requestPut(
        `${configUrl.prefix}/${configUrl.service}/${itemId}/collect`,
        data
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: TRANSACTION_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
      return error;
    }
  };
};

export const completeIdentityData = (itemId, body) => {
  return async dispatch => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}/${configUrl.service}/${itemId}/complete-identity-data`,
        body
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: TRANSACTION_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
      return error;
    }
  };
};

export const collectAllItem = itemId => {
  return async dispatch => {
    try {
      const res = await requestPut(
        `${configUrl.prefix}/${configUrl.service}/${itemId}/collect-all`
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: TRANSACTION_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
      return error;
    }
  };
};

export const inputStatusItem = (itemId, status) => {
  return async dispatch => {
    try {
      const res = await requestPut(
        `${configUrl.prefix}/${configUrl.service}/${itemId}/collect?result=${status}`
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: TRANSACTION_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const inputStatusAntigenItem = (itemId, body) => {
  return async dispatch => {
    try {
      const res = await requestPut(
        `${configUrl.prefix}/${configUrl.service}/${itemId}/antigen/result`,
        body
      );

      return res;
    } catch (error) {
      dispatch({
        type: TRANSACTION_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
      return error;
    }
  };
};

export const fetchDownloadResult = (transactionId, resultFilename) => {
  return async dispatch => {
    try {
      const res = await requestGetFile(
        `${configUrl.prefix}/${configUrl.service}/${transactionId}/antigen/download`
      );
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(res);
      link.setAttribute('download', resultFilename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      return res;
    } catch (error) {
      console.log(error);
    }
  };
};
