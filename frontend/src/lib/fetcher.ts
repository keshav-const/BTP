import axiosInstance from './axios-instance';

export const fetcher = async (url: string) => {
  try {
    const { data } = await axiosInstance.get(url);
    return data;
  } catch (error) {
    throw error;
  }
};
