const configUrl = {
  service: "cooperation-terms",
  version: "v1",
  prefix: "api",
};

export const resetPassword = (data) => {
  return async (dispatch) => {
    try {
      const res = await requestPost(`${configUrl.prefix}/${configUrl.version}/${configUrl.service}/users/forgot-password`,
        data
      );

      return res;
    } catch (error) {
      console.log(error);
      // dispatch({
      //   payload: {
      //     status: true,
      //     message: JSON.stringify(error.message),
      //     type: "error",
      //   },
      // });
    }
  }
}