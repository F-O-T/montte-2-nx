import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import type { PgliteDatabase } from 'drizzle-orm/pglite';

export type TestDatabase<
  TSchema extends Record<string, unknown> = Record<string, never>,
> = PgliteDatabase<TSchema>;

export type TestDatabaseHandle<
  TSchema extends Record<string, unknown> = Record<string, never>,
> = {
  client: PGlite;
  db: TestDatabase<TSchema>;
  dispose: () => Promise<void>;
};

export type TestDatabaseOptions<
  TSchema extends Record<string, unknown> = Record<string, never>,
> = {
  schema?: TSchema;
};

export type TestDatabaseFactory<
  TSchema extends Record<string, unknown> = Record<string, never>,
> = (
  options?: TestDatabaseOptions<TSchema>,
) => Promise<TestDatabaseHandle<TSchema>>;

export async function createTestDatabase<
  TSchema extends Record<string, unknown> = Record<string, never>,
>(
  options: TestDatabaseOptions<TSchema> = {},
): Promise<TestDatabaseHandle<TSchema>> {
  const client = new PGlite();
  const db = options.schema
    ? drizzle<TSchema>(client, { schema: options.schema })
    : drizzle<TSchema>(client);

  return {
    client,
    db,
    dispose: async () => {
      await client.close();
    },
  };
}
