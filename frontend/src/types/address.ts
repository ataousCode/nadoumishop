export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  userId: string;
}

export interface CreateAddressDto {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> {}

export interface AddressResponse {
  status: string;
  data: {
    address: Address;
  };
}

export interface AddressesResponse {
  status: string;
  results: number;
  data: {
    addresses: Address[];
  };
}

export interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
}
