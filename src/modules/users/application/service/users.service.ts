import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import bcrypt from "bcryptjs";
import type { PaginatedResult } from "@shared/infra/hateoas";
import {
  type CreateUserDto,
  type UpdateUserDto,
  type UserPayload,
  UserDto,
} from "@modules/users/application/dto/user.dto";
import { User } from "@modules/users/domain/models/user.entity";
import {
  USER_REPOSITORY,
  type UserRepository,
} from "@modules/users/domain/repositories/user-repository.interface";
import { MessagingPublisherService } from "@modules/messaging/application/services/messaging-publisher.service";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly messagingPublisher: MessagingPublisherService,
  ) {}

  async create(dto: CreateUserDto): Promise<void> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new ConflictException("Email already registered");

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = User.restore({
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      permissions: dto.permissions ?? [],
    })!;

    await this.userRepository.create(user);
    await this.messagingPublisher.publish("created", { id: user.id, email: user.email, permissions: user.permissions });
  }

  async edit(id: string, dto: UpdateUserDto): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException("User not found");

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing) throw new ConflictException("Email already registered");
      user.withEmail(dto.email.toLowerCase());
    }

    if (dto.password) {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      user.withPassword(hashedPassword);
    }

    if (dto.permissions !== undefined)
      user.withPermissions(dto.permissions);

    await this.userRepository.update(user);
    await this.messagingPublisher.publish("updated", { id: user.id, email: user.email, permissions: user.permissions });
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
    await this.messagingPublisher.publish("deleted", { id });
  }

  async listPaginated({ page, limit }: { page: number; limit: number }): Promise<PaginatedResult<UserDto>> {
    const allUsers = await this.userRepository.findAll();
    const total = allUsers.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = allUsers.slice(startIndex, endIndex);

    return {
      data: paginatedUsers.map((u) => UserDto.fromUser(u)!),
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<UserDto | null> {
    const user = await this.userRepository.findById(id);
    return UserDto.fromUser(user);
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<UserPayload | null> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    return { id: user.id!, email: user.email, permissions: user.permissions };
  }
}