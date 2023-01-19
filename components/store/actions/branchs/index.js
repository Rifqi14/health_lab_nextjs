import { requestGet } from "@config";
import axios from "axios";

const configUrl = {
  service: "branchs",
  version: "v1",
  prefix: "api",
};

export const fetchBranchSelectList = () => {
  return async (dispatch) => {
    try {
      const res = await requestGet(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/select-list`
      );
      return res;
    } catch (error) {
      console.log(error);
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
