import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { Collection } from '../../core';
import { addDocument, db, readDocuments } from '../utils';
import { Pokemon, bulbasaur } from '../mocks/pokemons';

describe('Update method', () => {
  let collection: Collection<Pokemon>;
  let documentId: string;

  beforeAll(() => {
    collection = new Collection<Pokemon>('pokemons', db());
  });

  beforeEach(async () => {
    const documentRef = await addDocument(collection.reference, bulbasaur);
    documentId = documentRef.id;
  });

  it('updates document in database', async () => {
    await collection.update(documentId, { type: ['Grass', 'Psychic'] });

    const [result] = await readDocuments(collection.reference);

    expect(result).toMatchObject({ name: 'Bulbasaur', type: ['Grass', 'Psychic'] });
  });
});
