import api from "../../services/api";
import type {
  AddressesResponse,
  AddressResponse,
  CreateAddressDto,
  UpdateAddressDto,
} from "../../types/address";

export const addressService = {
  getAddresses: async () => {
    const response = await api.get<AddressesResponse>("/addresses");
    return response.data;
  },

  createAddress: async (data: CreateAddressDto) => {
    const response = await api.post<AddressResponse>("/addresses", data);
    return response.data;
  },

  updateAddress: async (id: string, data: UpdateAddressDto) => {
    const response = await api.patch<AddressResponse>(`/addresses/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id: string) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },
};
