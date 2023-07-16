import {
  requestDelete,
  requestGet,
  requestPost,
  requestGetResultLabPartner
} from 'components/config';
import { LAB_CHECK_SAMPLECODE } from 'components/constants/LabResult';

const configUrl = {
  service: 'lab-result',
  version: 'v1',
  prefix: 'api'
};

export const fetchCheckSampleCode = params => {
  return async dispatch => {
    try {
      const res = await requestPost(
        `${configUrl.prefix}/${configUrl.version}/${configUrl.service}/validate-sample-code`,
        { ...params }
      );
      return res.payload;
    } catch (error) {
      console.log(error);
    }
  };
};
