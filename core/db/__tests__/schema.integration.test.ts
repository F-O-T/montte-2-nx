import { eq } from 'drizzle-orm';
import { readFile } from 'node:fs/promises';
import { createTestDatabase } from '@tooling/test/db';
import { afterEach, describe, expect, it } from 'vitest';

import * as schema from '../src/schema';
import { session, user } from '../src/schema/auth';

const handles: Array<Awaited<ReturnType<typeof createTestDatabase>>> = [];

afterEach(async () => {
  await Promise.all(handles.splice(0).map((handle) => handle.dispose()));
});

async function createMigratedDatabase() {
  const handle = await createTestDatabase({ schema });
  handles.push(handle);

  const migration = await readFile(
    new URL('../src/migrations/0000_square_the_twelve.sql', import.meta.url),
    'utf8',
  );

  await handle.client.exec(migration);

  return handle;
}

describe('core/db schema', () => {
  it('inserts and reads users through the schema', async () => {
    const handle = await createMigratedDatabase();

    await handle.db.insert(user).values({
      id: 'user_1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    });

    const users = await handle.db.select().from(user);

    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject({
      id: 'user_1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      emailVerified: false,
    });
  });

  it('enforces the unique email constraint', async () => {
    const handle = await createMigratedDatabase();

    await handle.db.insert(user).values({
      id: 'user_1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    });

    await expect(
      handle.db.insert(user).values({
        id: 'user_2',
        name: 'Grace Hopper',
        email: 'ada@example.com',
      }),
    ).rejects.toThrow(/Failed query:/);

    const users = await handle.db.select().from(user);

    expect(users).toHaveLength(1);
  });

  it('deletes dependent sessions when a user is removed', async () => {
    const handle = await createMigratedDatabase();

    await handle.db.insert(user).values({
      id: 'user_1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    });

    await handle.db.insert(session).values({
      id: 'session_1',
      token: 'token_1',
      userId: 'user_1',
      expiresAt: new Date('2030-01-01T00:00:00.000Z'),
      updatedAt: new Date('2030-01-01T00:00:00.000Z'),
    });

    await handle.db.delete(user).where(eq(user.id, 'user_1'));

    const sessions = await handle.db.select().from(session);

    expect(sessions).toHaveLength(0);
  });
});
