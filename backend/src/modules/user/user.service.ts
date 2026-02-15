import { UserRepository } from "./user.repository";
import { UpdateUserDto } from "./dto/user.dto";
import { AppError } from "../../utils/AppError";

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
    const user = await userRepository.update(userId, dto);
    return user;
  }
}
