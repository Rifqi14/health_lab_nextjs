import {
  interceptorRequestConfig,
  interceptorResponseErr
} from '@utils/interceptor';
import { objectString } from '@utils/string';
import axios from 'axios';
import { getItemLocalStorage } from '@utils/localstorage';

let cancelTokenSource;

const req = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

req.interceptors.request.use(interceptorRequestConfig);

// req.interceptors.response.use(
//   response => response,
//   error => interceptorResponseErr(error)
// );

export const requestGet = (url, params, headers) => {
  return new Promise((resolve, reject) => {
    if (typeof cancelTokenSource !== typeof undefined) {
      cancelTokenSource.cancel();
    }

    cancelTokenSource = axios.CancelToken.source();

    if (headers) {
      req.defaults.headers.common = {
        ...req.defaults.headers.common,
        ...headers
      };
    }

    req
      .get(`${url}${params ? objectString(params) : ''}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => reject(error));
  });
};

export const requestPost = (url, params) => {
  return new Promise((resolve, reject) => {
    req
      .post(`${url}`, params)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const requestPut = (url, params, body) => {
  return new Promise((resolve, reject) => {
    req
      .put(`${url}${params ? objectString(params) : ''}`, body)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const requestPatch = (url, params, body) => {
  return new Promise((resolve, reject) => {
    req
      .patch(`${url}${params ? objectString(params) : ''}`, body)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const requestDelete = (url, body) => {
  return new Promise((resolve, reject) => {
    req
      .delete(`${url}`, {
        data: body
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const requestPostMultipart = (url, params, headers) => {
  return new Promise((resolve, reject) => {
    req
      .post(
        `${url}`,
        params,
        headers && {
          headers: headers
        }
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const requestGetFile = (url, params, headers) => {
  return new Promise((resolve, reject) => {
    if (typeof cancelTokenSource !== typeof undefined) {
      cancelTokenSource.cancel();
    }

    cancelTokenSource = axios.CancelToken.source();

    if (headers) {
      req.defaults.headers.common = {
        ...req.defaults.headers.common,
        ...headers
      };
    }
    req.get(
      `${url}`,
      { responseType: 'blob' }
    ).then(response => {
      resolve(response.data);
    })
    .catch(error => reject(error));
  });
};

