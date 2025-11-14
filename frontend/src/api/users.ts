import axiosInstance from '@/lib/axios-instance';
import { Address, ApiResponse, UserProfile } from '@/types';

export interface AddressPayload {
  label?: string | null;
  fullName: string;
  phone?: string | null;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
}

export const usersApi = {
  getAddresses: async (userId: string) => {
    const response = await axiosInstance.get<ApiResponse<Address[]>>(`/users/${userId}/addresses`);
    return response.data;
  },

  createAddress: async (userId: string, payload: AddressPayload) => {
    const response = await axiosInstance.post<ApiResponse<Address[]>>(
      `/users/${userId}/addresses`,
      payload
    );
    return response.data;
  },

  updateAddress: async (userId: string, addressId: string, payload: Partial<AddressPayload>) => {
    const response = await axiosInstance.put<ApiResponse<Address[]>>(
      `/users/${userId}/addresses/${addressId}`,
      payload
    );
    return response.data;
  },

  deleteAddress: async (userId: string, addressId: string) => {
    const response = await axiosInstance.delete<ApiResponse<Address[]>>(
      `/users/${userId}/addresses/${addressId}`
    );
    return response.data;
  },

  updateProfile: async (userId: string, payload: UpdateProfilePayload) => {
    const response = await axiosInstance.put<ApiResponse<UserProfile>>(
      `/users/${userId}/profile`,
      payload
    );
    return response.data;
  },
};
