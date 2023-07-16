import {
  requestDelete,
  requestGet,
  requestPatch,
  requestPost
} from 'components/config';
import { ERROR_DIALOG } from 'components/constants/ErrorConst';
import {
  LAB_PARTNER_ALERT,
  LAB_PARTNER_FETCH_DATATABLE,
  LAB_PARTNER_FETCH_DETAIL,
  LAB_PARTNER_FETCH_SELECT_LIST,
  LAB_SELECT_LIST
} from 'components/constants/LapPartner';
import { errorMessage } from '../error';
import axios from 'axios';

const configUrl = {
  service: 'lab-partners',
  version: 'v1',
  prefix: 'api'
};

export const fetchDataTable = params => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/datatable`,
        { ...params }
      );

      dispatch({ type: LAB_PARTNER_FETCH_DATATABLE, payload: res.payload });

      return res;
    } catch (error) {
      console.log(error);
      // dispatch({
      //   type: LAB_PARTNER_ALERT,
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
export const fetchSelectList = params => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/datatable`,
        { ...params }
      );

      dispatch({
        type: LAB_PARTNER_FETCH_SELECT_LIST,
        payload: res.payload?.items
      });

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: LAB_PARTNER_ALERT,
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

export const fetchLabPartnerDetail = params => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/${params}`
      );
      dispatch({ type: LAB_PARTNER_FETCH_DETAIL, payload: res.payload });
      dispatch({
        type: LAB_PARTNER_ALERT,
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
        type: LAB_PARTNER_ALERT,
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

export const fetchLabSelectList = () => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/labs/select-list`
      );
      dispatch({ type: LAB_SELECT_LIST, payload: res.payload });

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: LAB_PARTNER_ALERT,
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

export const createLabPartner = data => {
  return async dispatch => {
    const res = await requestPost(
      `${configUrl.prefix}/${configUrl.version}/${configUrl.service}`,
      data
    )
      .then(res => {
        dispatch({
          type: LAB_PARTNER_ALERT,
          payload: {
            status: false,
            message: '',
            type: ''
          }
        });
        return res;
      })
      .catch(error => {
        dispatch({
          type: LAB_PARTNER_ALERT,
          payload: {
            status: true,
            message: error.response?.data.message
              ? JSON.stringify(error.response.data.message)
              : JSON.stringify(error.message),
            type: 'error'
          }
        });
        return error;
      });
    return res;
  };
};

export const updateLabPartner = (data, code) => {
  return async dispatch => {
    try {
      const res = await requestPatch(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/${code}`,
        {},
        data
      );
      dispatch({
        type: LAB_PARTNER_ALERT,
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
        type: LAB_PARTNER_ALERT,
        payload: {
          status: true,
          message: error.response?.data.message
            ? JSON.stringify(error.response.data.message)
            : JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const deleteLabPartner = params => {
  return async dispatch => {
    try {
      const res = await requestDelete(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/${params}`
      );
      dispatch({
        type: LAB_PARTNER_ALERT,
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
        type: LAB_PARTNER_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const labPartnerVerify = (token, otp) => {
  return async dispatch => {
    try {
      const res = axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/${configUrl.prefix}/${configUrl.version}/${configUrl.service}/${token}`,
        otp
      );

      return res;
    } catch (error) {
      console.log(error);
      alert(error.response.data ? error.response.data?.message : error.message);
      dispatch({
        type: LAB_PARTNER_ALERT,
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

export const uploadLogo = body => {
  return async dispatch => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/logo`,
        body
      );

      return res;
    } catch (error) {
      console.log(error);
      alert(
        error.response.data
          ? JSON.stringify(error.response.data?.message)
          : JSON.stringify(error.message)
      );
      dispatch({
        type: LAB_PARTNER_ALERT,
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
