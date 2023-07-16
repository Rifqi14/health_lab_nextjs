import {
  requestDelete,
  requestGet,
  requestPatch,
  requestPost
} from 'components/config';
import {
  ROLE_ALERT,
  ROLE_DELETE,
  ROLE_FETCH_ACCESS_MODULES,
  ROLE_FETCH_DATATABLE,
  ROLE_FETCH_DETAIL,
  ROLE_FETCH_EXTENSION_STATUS_DATA,
  ROLE_FETCH_SELECT_LIST_ROLE_TYPE
} from 'components/constants/Role';

const configUrl = {
  service: 'roles',
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
      dispatch({ type: ROLE_FETCH_DATATABLE, payload: res.payload });

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: ROLE_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const fetchRoleDetail = params => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/${params}`
      );
      dispatch({ type: ROLE_FETCH_DETAIL, payload: res.payload });

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: ROLE_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const fetchRoleModuleAccess = params => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/${params}`
      );
      dispatch({
        type: ROLE_FETCH_ACCESS_MODULES,
        payload: res.payload?.roleModules
      });

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: ROLE_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const fetchStatusData = () => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/extension/status-data/select-list`
      );
      dispatch({
        type: ROLE_FETCH_EXTENSION_STATUS_DATA,
        payload: res.payload
      });
      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: ROLE_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const fetchRoleTypes = () => {
  return async dispatch => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/select-list/role-type`
      );
      dispatch({
        type: ROLE_FETCH_SELECT_LIST_ROLE_TYPE,
        payload: res.payload
      });
      return res;
    } catch (error) {
      dispatch({
        type: ROLE_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};

export const createRole = data => {
  return async dispatch => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}`,
        data
      );

      return res;
    } catch (error) {
      dispatch({
        type: ROLE_ALERT,
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

export const updateRole = (data, code) => {
  return async dispatch => {
    try {
      const res = await requestPatch(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/${code}`,
        {},
        data
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: ROLE_ALERT,
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

export const deleteRole = params => {
  return async dispatch => {
    try {
      const res = await requestDelete(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/${params}`
      );

      return res;
    } catch (error) {
      console.log(error);
      dispatch({
        type: ROLE_ALERT,
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: 'error'
        }
      });
    }
  };
};
