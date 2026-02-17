import { CreateAddressDto, UpdateAddressDto } from "./dto/address.dto";
import { addressRepository } from "./address.repository";
import { AppError } from "../../utils/AppError";

export class AddressService {
  async createAddress(userId: string, input: CreateAddressDto) {
    // If setting as default, clear existing default
    if (input.isDefault) {
      await addressRepository.clearDefaultAddress(userId);
    } else {
      // If this is the FIRST address, force it to be default
      const existingAddresses = await addressRepository.findAllByUserId(userId);
      if (existingAddresses.length === 0) {
        input.isDefault = true;
      }
    }

    return await addressRepository.create(userId, input);
  }

  async getUserAddresses(userId: string) {
    return await addressRepository.findAllByUserId(userId);
  }

  async getAddressById(userId: string, addressId: string) {
    const address = await addressRepository.findById(addressId);

    if (!address) {
      throw new AppError("Address not found", 404);
    }

    if (address.userId !== userId) {
      throw new AppError(
        "You do not have permission to view this address",
        403,
      );
    }

    return address;
  }

  async updateAddress(
    userId: string,
    addressId: string,
    input: UpdateAddressDto,
  ) {
    // Check ownership
    const address = await this.getAddressById(userId, addressId);

    if (input.isDefault) {
      // Clear other defaults if this one is becoming default
      await addressRepository.clearDefaultAddress(userId);
    }

    return await addressRepository.update(addressId, input);
  }

  async deleteAddress(userId: string, addressId: string) {
    // Check ownership
    await this.getAddressById(userId, addressId);

    await addressRepository.delete(addressId);
  }
}

export const addressService = new AddressService();
