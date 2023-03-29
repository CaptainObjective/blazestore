import { beforeAll, describe, expect, it, vi } from 'vitest';

import { Collection } from '../../core';
import { addDocument, db } from '../utils';
import { bulbasaur, charmander, Pokemon } from '../mocks/pokemons';

describe('Subscribe method', () => {
  let collection: Collection<Pokemon>;

  beforeAll(() => {
    collection = new Collection<Pokemon>('pokemons', db());
  });

  it('invokes the callback when document is added to collection', async () => {
    const callback = vi.fn();
    const unsubscribe = collection.subscribe(callback);

    await addDocument(collection.reference, bulbasaur);
    await addDocument(collection.reference, charmander);
    unsubscribe();

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith([]);
    expect(callback).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(bulbasaur)]));
    expect(callback).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining(bulbasaur), expect.objectContaining(charmander)])
    );
  });
});
