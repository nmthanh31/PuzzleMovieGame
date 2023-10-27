import { Base_URL, API_Key } from '../configs/env';
import { axiosInstance } from './axiosInstance';

const findMovieAndTvShow = (name: string) => {
  return axiosInstance.get(`${Base_URL}/search/multi?query=${name}`, {
    params: {
      api_key: API_Key,
    },
  });
};
export { findMovieAndTvShow };
