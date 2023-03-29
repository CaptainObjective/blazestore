import { beforeAll, describe, expect, it } from 'vitest';

import { Collection } from '../../core';
import { bulbasaur, Pokemon } from '../mocks/pokemons';
import { db, readDocuments } from '../utils';

describe('Create method', () => {
  let collection: Collection<Pokemon>;
  beforeAll(() => {
    collection = new Collection<Pokemon>('pokemons', db());
  });

  it('creates new document in database', async () => {
    await collection.create(bulbasaur);

    const result = await readDocuments(collection.reference);

    expect(result[0]).toEqual(bulbasaur);
  });

  it('when id is not specified, returns randomly generated id of created document', async () => {
    const id = await collection.create(bulbasaur);

    expect(id).toBeDefined();
    expect(id).toBeTypeOf('string');
  });
});
