import { requestDelete, requestGet, requestPost } from 'components/config';
import {
  CORPORATE_ALERT,
  CORPORATE_FETCH_DETAIL,
  CORPORATE_FETCH_SELECT_LIST
} from 'components/constants/Corporate';
import axios from 'axios';

const configUrl = {
  service: 'corporates',
  version: 'v1',
  prefix: 'api'
};

export const fetchCorporateSelectList = params => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/datatable`,
        { ...params }
      );

      dispatch({
        type: CORPORATE_FETCH_SELECT_LIST,
        payload: res.payload.items
      });
      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: CORPORATE_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const fetchCorporateDetail = id => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/${id}`
      );

      dispatch({
        type: CORPORATE_FETCH_DETAIL,
        payload: res.payload
      });
      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: CORPORATE_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const verifyOtp = (token, otp) => {
  return async dispatch => {
    try {
      const res = axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/${configUrl.prefix}/${configUrl.version}/${configUrl.service}/${token}`,
          {
            otp: otp
          }
        )
        .then(res => {
          dispatch({
            type: CORPORATE_ALERT,
            payload: {
              status: true,
              message: res.message,
              type: 'success'
            }
          });
          return res;
        })
        .catch(error => {
          dispatch({
            type: CORPORATE_ALERT,
            payload: {
              status: true,
              message: JSON.stringify(error.message),
              type: 'error'
            }
          });
          return error;
        });
      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: CORPORATE_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const createMasterCorporate = data => {
  return async dispatch => {
    const res = await requestPost(
      `${configUrl.prefix}/${configUrl.version}/${configUrl.service}`,
      data
    )
      .then(res => {
        dispatch({
          type: CORPORATE_ALERT,
          payload: {
            status: true,
            message: res.message,
            type: 'success'
          }
        });
        return res;
      })
      .catch(error => {
        dispatch({
          type: CORPORATE_ALERT,
          payload: {
            status: true,
            message: JSON.stringify(error.message),
            type: 'error'
          }
        });
        return error;
      });
    return res;
  };
};

export const uploadDocument = body => {
  return async dispatch => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/document`,
        body
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: CORPORATE_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const getSiteOption = () => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/sites/select-list`
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: CORPORATE_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const deleteCorporate = code => {
  return async dispatch => {
    try {
      const res = await requestDelete(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/${code}`
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: CORPORATE_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const getDocument = documentId => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/${documentId}`
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: CORPORATE_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};
