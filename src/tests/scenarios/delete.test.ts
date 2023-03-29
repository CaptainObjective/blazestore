import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { Collection } from '../../core';
import { bulbasaur, Pokemon } from '../mocks/pokemons';
import { addDocument, db, readDocuments } from '../utils';

describe('Delete method', () => {
  let collection: Collection<Pokemon>;
  let documentId: string;

  beforeAll(() => {
    collection = new Collection<Pokemon>('pokemons', db());
  });

  beforeEach(async () => {
    const documentRef = await addDocument(collection.reference, bulbasaur);
    documentId = documentRef.id;
  });

  it('deletes document in database', async () => {
    await collection.delete(documentId);

    const result = await readDocuments(collection.reference);

    expect(result).toEqual([]);
  });
});
