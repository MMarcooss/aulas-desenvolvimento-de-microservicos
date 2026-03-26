import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { DrizzleService } from "../drizzle.service";
import { usersSchema } from "./user.schema";
import { User } from "./user.entity";
import { CreateUserDto } from "./user.dto";

export interface UserPayload {
  id: string;
  email: string;
  permissions: string[];
}

@Injectable()
export class UsersService {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.drizzle.db.query.usersSchema.findFirst({
      where: eq(usersSchema.email, dto.email),
    });
    if (existing) throw new ConflictException("Email already in use");

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const now = new Date();

    const [row] = await this.drizzle.db
      .insert(usersSchema)
      .values({
        email: dto.email,
        password: hashedPassword,
        permissions: dto.permissions ?? [],
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return User.restore(row);
  }

  async findById(id: string): Promise<User> {
    const row = await this.drizzle.db.query.usersSchema.findFirst({
      where: eq(usersSchema.id, id),
    });
    if (!row) throw new NotFoundException("User not found");
    return User.restore(row);
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<UserPayload | null> {
    const row = await this.drizzle.db.query.usersSchema.findFirst({
      where: eq(usersSchema.email, email),
    });
    if (!row) return null;

    const isValid = await bcrypt.compare(password, row.password);
    if (!isValid) return null;

    return { id: row.id, email: row.email, permissions: row.permissions };
  }
}
