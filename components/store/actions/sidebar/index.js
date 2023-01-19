import { requestGet } from '@config';
import { SIDEBAR_MODULE } from '@constants/Sidebar';

const configUrl = {
  service: 'modules',
  version: 'v1',
  prefix: 'api'
};

export const fetchSidebar = () => {
  return async dispatch => {
    try {
      const url = `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/select-list`;
      console.log(url);
      const res = await requestGet(url, null);

      dispatch({
        type: SIDEBAR_MODULE,
        payload: res.payload
      });

      return res;
    } catch (error) {
      console.error('ERROR', error);
    }
  };
};
