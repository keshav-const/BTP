import axios, { AxiosError } from 'axios';
import { ApiError } from '@/types';

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const responseData = axiosError.response?.data as Record<string, unknown> | undefined;
    return {
      status: axiosError.response?.status || 500,
      message:
        (responseData?.message as string) ||
        axiosError.message ||
        'An error occurred',
      data: axiosError.response?.data,
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message,
    };
  }

  return {
    status: 500,
    message: 'An unknown error occurred',
  };
};
