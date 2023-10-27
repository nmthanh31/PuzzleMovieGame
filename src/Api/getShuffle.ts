import { Base_URL, API_Key } from '../configs/env';
import { axiosInstance } from './axiosInstance';

const getShuffle = (id: String, media_type: String) => {
  return axiosInstance.get(Base_URL + "/" + media_type + "/" + id + "/recommendations", {
    params: {
      api_key: API_Key,
    },
  });
};
export { getShuffle };
