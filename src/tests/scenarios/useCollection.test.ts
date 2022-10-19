/**
 * @vitest-environment happy-dom
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { Collection } from '@core';
import { useCollection } from '@react';
import { renderHook } from '@testing-library/react';

import { bulbasaur, pikachu, Pokemon } from '../mocks/pokemons';
import { db, addDocument } from '../utils';

describe('Create method', () => {
  let collection: Collection<Pokemon>;
  beforeAll(() => {
    collection = new Collection<Pokemon>('pokemons', db());
  });

  it('updates value when document is added', async () => {
    const { result } = renderHook(() => useCollection(collection, { sortBy: { pokedexId: 'Ascending' } }));
    expect(result.current).toEqual([]);

    await addDocument(collection.reference, bulbasaur);
    expect(result.current).toMatchObject([bulbasaur]);

    await addDocument(collection.reference, pikachu);
    expect(result.current).toMatchObject([bulbasaur, pikachu]);
  });
});
