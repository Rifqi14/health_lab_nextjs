import { requestDelete, requestGet, requestPost } from "@config";
import {
  COOPERATION_TERM_ALERT,
  COOPERATION_TERM_SELECT_LIST,
} from "@constants/CooperationTerm";

const configUrl = {
  service: "cooperation-terms",
  version: "v1",
  prefix: "api",
};

export const getCooperationTerms = () => {
  return async (dispatch) => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/datatable`
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: COOPERATION_TERM_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: "error",
        },
      });
    }
  };
};

export const fetchCooperationTermSelectList = () => {
  return async (dispatch) => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/select-list`
      );
      dispatch({ type: COOPERATION_TERM_SELECT_LIST, payload: res.payload });
      console.log(res);

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: COOPERATION_TERM_ALERT,
        payload: {
          status: true,
          message: error.response.data
            ? JSON.stringify(error.response.data?.message)
            : JSON.stringify(error.message),
          type: "error",
        },
      });
    }
  };
};

export const createCooperationTerms = (data) => {
  return async (dispatch) => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}`,
        data
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: COOPERATION_TERM_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: "error",
        },
      });
    }
  };
};

export const uploadDocument = (body) => {
  return async (dispatch) => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/document`,
        body
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: COOPERATION_TERM_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: "error",
        },
      });
    }
  };
};

export const deleteCooperationTerm = (id) => {
  return async (dispatch) => {
    try {
      const res = await requestDelete(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/${id}`
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: COOPERATION_TERM_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: "error",
        },
      });
    }
  };
};

export const updateCooperationTerms = (id, body) => {
  return async (dispatch) => {
    try {
      const res = await requestPatch(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/${id}`,
        body
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: COOPERATION_TERM_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: "error",
        },
      });
    }
  };
};

export const getCooperationTermsById = (id) => {
  return async (dispatch) => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/${id}`
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: COOPERATION_TERM_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: "error",
        },
      });
    }
  };
};
