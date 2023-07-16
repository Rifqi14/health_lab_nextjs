import {
  requestDelete,
  requestGet,
  requestPost,
  requestGetFile,
  requestPatch
} from 'components/config';
import {
  LAB_TRANSACTION_ALERT,
  LAB_TRANSACTION_FETCH_DATATABLE,
  LAB_TRANSACTION_FETCH_DETAIL,
  LAB_PARTNER_FETCH_SELECT_LIST
} from 'components/constants/LabTransaction';
import { currencyFormatter } from 'components/utils/number';
import { useLinkClickHandler } from 'react-router-dom';

const configUrl = {
  service: 'lab-partner-transaction',
  version: 'v1',
  prefix: 'api'
};

export const fetchLabTransactionDataTable = params => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.service}/datatable`,
        { ...params }
      );

      dispatch({ type: LAB_TRANSACTION_FETCH_DATATABLE, payload: res.payload });

      return res;
    } catch (error) {
      console.log(error);
      // dispatch({
      //   type: LAB_TRANSACTION_ALERT,
      //   payload: {
      //     status: true,
      //     message: error.response.data
      //       ? JSON.stringify(error.response.data?.message)
      //       : JSON.stringify(error.message),
      //     type: 'error'
      //   }
      // });
    }
  };
};

export const fetchLabTransactionDetail = params => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.service}/${params}`
      );
      if (res.statusCode === 200) {
        const items = res.payload.items.map(item => {
          return {
            ...item,
            product: {
              value: item.productId,
              label:
                item.productName + ' - ' + currencyFormatter(item.productPrice),
              productId: item.productId,
              productName: item.productName,
              productPrice: item.productPrice
            }
          };
        });
        res.payload.items = items;
        dispatch({ type: LAB_TRANSACTION_FETCH_DETAIL, payload: res.payload });
      }
      dispatch({
        type: LAB_TRANSACTION_ALERT,
        payload: {
          status: false,
          message: '',
          type: ''
        }
      });

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: LAB_TRANSACTION_ALERT,
        payload: {
          status: true,
          message: error.response.data
            ? JSON.stringify(error.response.data?.message)
            : JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const createLabTransaction = data => {
  return async dispatch => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}/${configUrl.service}`,
        data
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: LAB_TRANSACTION_ALERT,
        payload: {
          status: true,
          message: error.response.data.message
            ? JSON.stringify(error.response.data.message)
            : JSON.stringify(error.message),
          type: 'error'
        }
      });
      return error;
    }
  };
};

export const deleteLabTransaction = id => {
  return async dispatch => {
    try {
      const res = await requestDelete(
        `${configUrl.prefix}/${configUrl.service}/${id}/delete`
      );

      return res;
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.message
          ? JSON.stringify(error.response.data.message)
          : JSON.stringify(error.message)
      );
      dispatch({
        type: LAB_TRANSACTION_ALERT,
        payload: {
          status: true,
          message: error.response.data.message
            ? JSON.stringify(error.response.data.message)
            : JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const addLabTransactionItems = (id, data) => {
  return async dispatch => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}/${configUrl.service}/${id}/add-transaction-item`,
        data
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: LAB_TRANSACTION_ALERT,
        payload: {
          status: true,
          message: error.response.data.message
            ? JSON.stringify(error.response.data.message)
            : JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const sendLabTransactionToPic = id => {
  return async dispatch => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}/${configUrl.service}/${id}/send-to-pic`,
        data
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: LAB_TRANSACTION_ALERT,
        payload: {
          status: true,
          message: error.response.data.message
            ? JSON.stringify(error.response.data.message)
            : JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const fetchLabPartnerSelectList = () => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}//${configUrl.service}/lab-partner/select-list`
      );

      dispatch({ type: LAB_PARTNER_FETCH_SELECT_LIST, payload: res.payload });

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
    }
  };
};

export const fetchAntigenDetailData = params => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.service}/antigen/download`,
        { ...params }
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: LAB_TRANSACTION_ALERT,
        payload: {
          status: true,
          message: error.response.data
            ? JSON.stringify(error.response.data?.message)
            : JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const fetchDownloadResult = (transactionId, fileName) => {
  return async dispatch => {
    try {
      const res = await requestGetFile(
        `${configUrl.prefix}/${configUrl.service}/${transactionId}/result/download`,
        transactionId
      );
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(res);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      return res;
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateTierPricing = data => {
  return async dispatch => {
    try {
      const res = await requestPatch(
        `${configUrl.prefix}/${configUrl.service}/update-tier-pricing`,
        {},
        data
      );

      return res;
    } catch (error) {
      console.log(error);
    }
  };
};
