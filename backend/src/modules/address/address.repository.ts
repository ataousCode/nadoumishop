import { prisma } from "../../config/prisma";
import { CreateAddressDto, UpdateAddressDto } from "./dto/address.dto";

export class AddressRepository {
  async create(userId: string, data: CreateAddressDto) {
    return prisma.address.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAllByUserId(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" }, // Default address first
    });
  }

  async findById(id: string) {
    return prisma.address.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateAddressDto) {
    return prisma.address.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.address.delete({
      where: { id },
    });
  }

  async clearDefaultAddress(userId: string) {
    // This sets all addresses for the user to isDefault: false
    // Used before setting a new default
    return prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
}

export const addressRepository = new AddressRepository();
