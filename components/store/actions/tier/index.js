import { requestGet } from 'components/config';
import { TIER_FETCH_SELECT_LIST } from 'components/constants/Tier';

const configUrl = {
  service: 'tier',
  version: 'v1',
  prefix: 'api'
};

export const fetchTierSelectList = () => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/select-list`
      );
      dispatch({ type: TIER_FETCH_SELECT_LIST, payload: res.payload });
      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: TIER_FETCH_SELECT_LIST,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};
