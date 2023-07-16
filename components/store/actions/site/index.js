import { requestGet, requestPost, requestPut } from 'components/config';
import { TRANSACTION_ALERT } from 'components/constants/Transaction';

import { SITE_FETCH_SELECT_LIST } from 'components/constants/Site';

const configUrl = {
  service: 'sites',
  prefix: 'api'
};

export const fetchSelectSiteHousecall = () => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/v1/${configUrl.service}/select-list`
      );

      dispatch({
        type: SITE_FETCH_SELECT_LIST,
        payload: res.payload
      });

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
