import { DRIZZLE_PROVIDER, DrizzleDB } from "@shared/infra/database/drizzle.service";
import { Inject, Injectable } from "@nestjs/common";
import { usersSchema } from "@shared/infra/database/schemas/user.schema";
import { User } from "@users/domain/models/user.entity";
import { UserRepository } from "@users/domain/repositories/user-repository.interface";
import { eq } from "drizzle-orm";

@Injectable()
export class DrizzleUserRepository implements UserRepository {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: DrizzleDB,
	) {}

	async create(user: User): Promise<void> {
		await this.db.insert(usersSchema).values({
			email: user.email,
			password: user.password,
			teacherId: user.teacherId,
			permissions: user.permissions,
		});
	}

	async findById(id: string): Promise<User | null> {
		const result = await this.db.query.usersSchema.findFirst({
			where: eq(usersSchema.id, id),
		});
		return User.restore({
			id: result?.id,
			email: result?.email ?? "",
			password: result?.password ?? "",
			teacherId: result?.teacherId,
			permissions: result?.permissions ?? [],
			createdAt: result?.createdAt,
			updatedAt: result?.updatedAt,
		});
	}

	async findByEmail(email: string): Promise<User | null> {
		const result = await this.db.query.usersSchema.findFirst({
			where: eq(usersSchema.email, email.toLowerCase()),
		});
		return User.restore({
			id: result?.id,
			email: result?.email ?? "",
			password: result?.password ?? "",
			teacherId: result?.teacherId,
			permissions: result?.permissions ?? [],
			createdAt: result?.createdAt,
			updatedAt: result?.updatedAt,
		});
	}

	async findAll(): Promise<User[]> {
		const results = await this.db.query.usersSchema.findMany({
			orderBy: (usersSchema, { desc }) => [desc(usersSchema.createdAt)],
		});
		return results
			.map((r) =>
				User.restore({
					id: r.id,
					email: r.email,
					password: r.password,
					teacherId: r.teacherId,
					permissions: r.permissions,
					createdAt: r.createdAt,
					updatedAt: r.updatedAt,
				}),
			)
			.filter(Boolean) as User[];
	}

	async update(user: User): Promise<void> {
		if (!user.id) return;
		await this.db
			.update(usersSchema)
			.set({
				email: user.email,
				password: user.password,
				teacherId: user.teacherId,
				permissions: user.permissions,
				updatedAt: new Date(),
			})
			.where(eq(usersSchema.id, user.id));
	}

	async delete(id: string): Promise<void> {
		await this.db.delete(usersSchema).where(eq(usersSchema.id, id));
	}
}
