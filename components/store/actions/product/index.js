import { requestGet } from '@config';
import {
  PRODUCT_ALERT,
  PRODUCT_FETCH_COVID_SELECT_LIST,
  PRODUCT_FETCH_MCU_SELECT_LIST,
  PRODUCT_FETCH_SELECT_LIST,
  PRODUCT_FETCH_TIER_SELECT_LIST
} from '@constants/Product';

const configUrl = {
  service: 'product',
  version: 'v1',
  prefix: 'api'
};

export const fetchCovidSelectList = params => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/covid/select-list`,
        { ...params }
      );
      dispatch({ type: PRODUCT_FETCH_COVID_SELECT_LIST, payload: res.payload });

      return res;
    } catch (error) {
      dispatch({
        type: PRODUCT_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const fetchMcuSelectList = params => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/mcu/select-list`,
        { ...params }
      );
      dispatch({ type: PRODUCT_FETCH_MCU_SELECT_LIST, payload: res.payload });

      return res;
    } catch (error) {
      dispatch({
        type: PRODUCT_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const fetchProductSelectList = params => {
  return async dispatch => {
    try {
      const covid = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/covid/select-list`
      );
      const mcu = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/mcu/select-list`
      );
      dispatch({
        type: PRODUCT_FETCH_SELECT_LIST,
        payload: covid.payload
          .map(item => {
            return { ...item, type: 'Covid' };
          })
          .concat(
            mcu.payload.map(item => {
              return { ...item, type: 'MCU' };
            })
          )
      });

      return covid.payload
        .map(item => {
          return { ...item, type: 'Covid' };
        })
        .concat(
          mcu.payload.map(item => {
            return { ...item, type: 'MCU' };
          })
        );
    } catch (error) {
      dispatch({
        type: PRODUCT_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const fetchProductTierSelectList = tier => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/tier/${tier}/select-list`
      );
      dispatch({
        type: PRODUCT_FETCH_TIER_SELECT_LIST,
        payload: res.payload
      });

      return res;
    } catch (error) {
      dispatch({
        type: PRODUCT_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};
