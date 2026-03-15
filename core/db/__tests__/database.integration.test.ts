import { createTestDatabase } from '@tooling/test/db';
import { afterEach, describe, expect, it } from 'vitest';

const handles: Array<Awaited<ReturnType<typeof createTestDatabase>>> = [];

afterEach(async () => {
  await Promise.all(handles.splice(0).map((handle) => handle.dispose()));
});

describe('test database', () => {
  it('creates an in-memory postgres database that accepts SQL', async () => {
    const handle = await createTestDatabase();
    handles.push(handle);

    await handle.client.exec(`
      create table smoke_test (
        id integer primary key,
        name text not null
      );
    `);
    await handle.client.exec(`
      insert into smoke_test (id, name)
      values (1, 'ok');
    `);

    const result = await handle.client.query<{ count: number }>(
      'select count(*)::int as count from smoke_test;',
    );

    expect(result.rows[0]?.count).toBe(1);
  });
});
