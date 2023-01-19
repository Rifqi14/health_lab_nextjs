import { requestGet, requestPost, requestPut, requestDelete } from '@config';
import {
  TRANSACTION_ALERT,
  TRANSACTION_FETCH_DATATABLE,
  TRANSACTION_FETCH_DOCUMENT_LIST,
  TRANSACTION_FETCH_ITEMS
} from '@constants/Transaction';

const configUrl = {
  service: '/transaction',
  prefix: 'api'
};

export const fetchTransactionDataTable = params => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}${configUrl.service}/datatable`,
        { ...params }
      );

      dispatch({ type: TRANSACTION_FETCH_DATATABLE, payload: res.payload });

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

export const fetchTransactionItems = transactionId => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}${configUrl.service}/${transactionId}/items`
      );

      if (!res.isSuccess && res.statusCode !== 200) {
        dispatch({ type: TRANSACTION_FETCH_ITEMS, payload: undefined });
      }

      dispatch({ type: TRANSACTION_FETCH_ITEMS, payload: res.payload });
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

export const fetchTransactionDocumentList = transactionId => {
  return async dispatch => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}${configUrl.service}/${transactionId}/document-list`
      );

      if (!res.isSuccess && res.statusCode !== 200) {
        dispatch({ type: TRANSACTION_FETCH_DOCUMENT_LIST, payload: undefined });
      }

      dispatch({ type: TRANSACTION_FETCH_DOCUMENT_LIST, payload: res.payload });
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

export const uploadDocument = body => {
  return async dispatch => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}${configUrl.service}/document`,
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
      return error
    }
  };
};
export const fetchAntigenDetailData = (data) => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}//${configUrl.service}/antigen/download`,
        data
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: LAB_PARTNER_FETCH_SELECT_LIST,
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

export const deleteDocument = (id) => {
  return async dispatch => {
    try {
      const res = await requestDelete(
        `${configUrl.prefix}${configUrl.service}/document/${id}`
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
      return error
    }
  };
}
