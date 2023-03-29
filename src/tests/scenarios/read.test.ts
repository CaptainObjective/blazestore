import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { Collection } from '../../core';
import { pokemons, Pokemon, charmander, pikachu, bulbasaur, squirtle } from '../mocks/pokemons';
import { addDocument, db } from '../utils';

describe('Read method', () => {
  let collection: Collection<Pokemon>;
  beforeAll(() => {
    collection = new Collection<Pokemon>('pokemons', db());
  });

  beforeEach(async () => {
    await Promise.all(pokemons.map((document) => addDocument(collection.reference, document)));
  });

  it('returns all records from given collection', async () => {
    const result = await collection.read();
    expect(result).toHaveLength(pokemons.length);
  });

  describe('returns filtered records', () => {
    it('when filtering by text', async () => {
      const [result] = await collection.read({ where: { name: { is: 'Charmander' } } });
      expect(result).toMatchObject(charmander);
    });

    it('when filtering by number', async () => {
      const [result] = await collection.read({ where: { pokedexId: { greaterThan: 24 } } });
      expect(result).toMatchObject(pikachu);
    });

    it('when filtering by array content', async () => {
      const [result] = await collection.read({ where: { type: { contains: 'Fire' } } });
      expect(result).toMatchObject(charmander);
    });

    it('when filtering by array contents', async () => {
      const [result] = await collection.read({ where: { type: { containsAny: ['Fire'] } } });
      expect(result).toMatchObject(charmander);
    });
  });

  describe('returns sorted records', () => {
    const getName = (pokemon: Pokemon) => pokemon.name;
    const byName = (current: Pokemon, next: Pokemon) => next.name.localeCompare(current.name);
    const byPokedexId = (current: Pokemon, next: Pokemon) => next.pokedexId - current.pokedexId;

    it('when sorting by number field', async () => {
      const result = await collection.read({ sortBy: { pokedexId: 'Descending' } });

      const expected = pokemons.sort(byPokedexId).map(getName);
      const names = result.map(getName);
      expect(names).toEqual(expected);
    });

    it('when sorting by text field', async () => {
      const result = await collection.read({ sortBy: { name: 'Descending' } });

      const expected = pokemons.sort(byName).map(getName);
      const names = result.map(getName);
      expect(names).toEqual(expected);
    });

    it('when sorting by two diffrent fields', async () => {
      const result = await collection.read({ sortBy: [{ name: 'Descending' }, { pokedexId: 'Descending' }] });

      const expected = pokemons.sort(byPokedexId).sort(byName).map(getName);
      const names = result.map(getName);
      expect(names).toEqual(expected);
    });
  });

  describe('returns limited records', () => {
    it('when taking first result', async () => {
      const result = await collection.read({ sortBy: { pokedexId: 'Ascending' }, takeFirst: 1 });
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(bulbasaur);
    });

    it('when taking last results', async () => {
      const result = await collection.read({ sortBy: { pokedexId: 'Ascending' }, takeLast: 2 });

      const expected = [squirtle, pikachu].map(expect.objectContaining);
      expect(result).toHaveLength(2);
      expect(result).toEqual(expected);
    });
  });
});
