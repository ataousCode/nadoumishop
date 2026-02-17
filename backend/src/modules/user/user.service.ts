import { UserRepository } from "./user.repository";
import { UpdateUserDto, UpdatePasswordDto } from "./dto/user.dto";
import { AppError } from "../../utils/AppError";
import bcrypt from "bcrypt";

const userRepository = new UserRepository();

export class UserService {
  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    return await userRepository.update(userId, dto);
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new AppError("Invalid current password", 401);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);

    await userRepository.update(userId, { password: hashedPassword });
  }

  async getAllUsers() {
    return await userRepository.findAll();
  }

  async updateUser(userId: string, data: any) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }

    return await userRepository.update(userId, data);
  }

  async createUser(data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }
    return await userRepository.create(data);
  }

  async deleteUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return await userRepository.delete(userId);
  }

  async toggleBlockStatus(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const newStatus = !user.isBlocked;
    return await userRepository.update(userId, { isBlocked: newStatus });
  }
}

export const userService = new UserService();
