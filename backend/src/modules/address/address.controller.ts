import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { addressService } from "./address.service";
import { CreateAddressDto, UpdateAddressDto } from "./dto/address.dto";

export const createAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id; // Assumes auth middleware populates user
    const input: CreateAddressDto = req.body;

    const address = await addressService.createAddress(userId, input);

    res.status(201).json({
      status: "success",
      data: {
        address,
      },
    });
  },
);

export const getAddresses = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const addresses = await addressService.getUserAddresses(userId);

    res.status(200).json({
      status: "success",
      results: addresses.length,
      data: {
        addresses,
      },
    });
  },
);

export const getAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const addressId = req.params.id as string;

    const address = await addressService.getAddressById(userId, addressId);

    res.status(200).json({
      status: "success",
      data: {
        address,
      },
    });
  },
);

export const updateAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const addressId = req.params.id as string;
    const input: UpdateAddressDto = req.body;

    const address = await addressService.updateAddress(
      userId,
      addressId,
      input,
    );

    res.status(200).json({
      status: "success",
      data: {
        address,
      },
    });
  },
);

export const deleteAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const addressId = req.params.id as string;

    await addressService.deleteAddress(userId, addressId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);
