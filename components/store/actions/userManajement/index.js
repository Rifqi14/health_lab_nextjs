import { requestGet, requestPost } from "@config";

const configUrl = {
  service: "users",
  version: "v1",
  prefix: "api",
};

export const createRoleManagement = (data) => {
  return async dispatch => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}`,
        data
      );
      return res;
    } catch (error) {
      dispatch({
        payload: {
          status: true,
          message: JSON.stringify(error.message),
          type: "error",
        },
      });
    }
  };
};


export const getDataTable = () => {
  return async dispatch => {
    try {
      return res = await requestGet(``)
    } catch (error) {
      console.log(error)
    }
  }
}
