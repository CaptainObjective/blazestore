export const bulbasaur = { pokedexId: 1, name: 'Bulbasaur', type: ['Grass', 'Poison'] };
export const charmander = { pokedexId: 4, name: 'Charmander', type: ['Fire'] };
export const squirtle = { pokedexId: 7, name: 'Squirtle', type: ['Water'] };
export const pikachu = { pokedexId: 25, name: 'Pikachu', type: ['Electric'] };

export const pokemons = [bulbasaur, charmander, squirtle, pikachu];
export type Pokemon = typeof pokemons[number];
