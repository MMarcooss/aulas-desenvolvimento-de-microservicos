import { User } from "../models/user.entity";

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");

export interface UserRepository {
	create(user: User): Promise<void>;
	findById(id: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	findAll(): Promise<User[]>;
	update(user: User): Promise<void>;
	delete(id: string): Promise<void>;
}
