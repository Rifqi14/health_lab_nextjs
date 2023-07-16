import { requestGet, requestPost } from 'components/config';
import {
  CORPORATE_TRX_ALERT,
  CORPORATE_TRX_FETCH_DATATABLE,
  CORPORATE_TRX_FETCH_DETAIL
} from 'components/constants/CorporateTransaction';
import { TRANSACTION_FETCH_IN_HOUSE_DETAIL } from 'components/constants/Transaction';

const configUrl = {
  service: 'coporate-transaction',
  version: 'v1',
  prefix: 'api'
};

export const fetchCorporateTrxDataTable = params => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/datatable`,
        { ...params }
      );
      dispatch({
        type: CORPORATE_TRX_FETCH_DATATABLE,
        payload: {
          ...res.payload,
          items: res.payload.items
            ? res.payload.items.map(item => {
                return { ...item, typeService: 'Web Reg' };
              })
            : []
        }
      });

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: CORPORATE_TRX_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const fetchCorporateTrxDetail = params => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/detail/${params}`
      );
      dispatch({ type: CORPORATE_TRX_FETCH_DETAIL, payload: res.payload });
      dispatch({
        type: TRANSACTION_FETCH_IN_HOUSE_DETAIL,
        payload: res.payload
      });

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: CORPORATE_TRX_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const createCorporateTrx = data => {
  return async dispatch => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}`,
        data
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: CORPORATE_TRX_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const setStatus = data => {
  return async dispatch => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/transaction-item/set-status`,
        data
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: CORPORATE_TRX_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};
