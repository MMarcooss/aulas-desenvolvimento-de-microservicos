import { Inject, Injectable } from "@nestjs/common";
import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schemas from "./schemas";

export const DRIZZLE_PROVIDER = "DRIZZLE_PROVIDER";

export type DrizzleDB = NodePgDatabase<typeof schemas>;

@Injectable()
export class DrizzleService {
	private readonly db: DrizzleDB;

	constructor(
		@Inject("DATABASE_URL")
		private readonly databaseUrl: string,
	) {
		const pool = new Pool({
			connectionString: this.databaseUrl,
		});
		this.db = drizzle(pool, { schema: schemas });
	}

	getDB(): DrizzleDB {
		return this.db;
	}
}
