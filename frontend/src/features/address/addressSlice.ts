import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { addressService } from "./addressService";
import type {
  AddressState,
  AddressesResponse,
  AddressResponse,
  CreateAddressDto,
  UpdateAddressDto,
} from "../../types/address";

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const initialState: AddressState = {
  addresses: [],
  isLoading: false,
  error: null,
};

export const getAddresses = createAsyncThunk(
  "address/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await addressService.getAddresses();
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to fetch addresses";
      return rejectWithValue(errorMessage);
    }
  },
);

export const createAddress = createAsyncThunk(
  "address/create",
  async (data: CreateAddressDto, { rejectWithValue }) => {
    try {
      const response = await addressService.createAddress(data);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to create address";
      return rejectWithValue(errorMessage);
    }
  },
);

export const updateAddress = createAsyncThunk(
  "address/update",
  async (
    { id, data }: { id: string; data: UpdateAddressDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await addressService.updateAddress(id, data);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to update address";
      return rejectWithValue(errorMessage);
    }
  },
);

export const deleteAddress = createAsyncThunk(
  "address/delete",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await addressService.deleteAddress(id);
      dispatch(getAddresses());
      return id;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to delete address";
      return rejectWithValue(errorMessage);
    }
  },
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddressError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Addresses
      .addCase(getAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAddresses.fulfilled,
        (state, action: PayloadAction<AddressesResponse>) => {
          state.isLoading = false;
          state.addresses = action.payload.data.addresses;
        },
      )
      .addCase(getAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Address
      .addCase(createAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createAddress.fulfilled,
        (state, action: PayloadAction<AddressResponse>) => {
          state.isLoading = false;
          state.addresses.push(action.payload.data.address);
        },
      )
      .addCase(createAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Address
      .addCase(updateAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateAddress.fulfilled,
        (state, action: PayloadAction<AddressResponse>) => {
          state.isLoading = false;
          const index = state.addresses.findIndex(
            (a) => a.id === action.payload.data.address.id,
          );
          if (index !== -1) {
            state.addresses[index] = action.payload.data.address;
          }
        },
      )
      .addCase(updateAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;
