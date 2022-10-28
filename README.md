# Typed Firestore

## Why

Firestore is cool database packed with a lot of features. Sometimes the number of features can be overwhelming and it feels like you have to get PhD in Firestore's docs to perform a simple CRUD operation. The goal of this library is to provide easy-to-use and type-safe API to interact with firestore instance, whilst still leaving the ability to use original API for more advanced use cases.

## What

Typed Firestore is a tiny wrapper around `firebase/firestore` package offering simple interface to do basic operations against firestore instance. Collections and documents created with this package are not special in any way and can be interacted throughout regular `firebase/firestore` API. To get firebase collection reference just use `collection.reference`. All limitations imposed by firestore (e.g.: you cannot filter by two different fields at the same time without composed index) are still applicable.

## How

To use typed firestore first you need to create firestore instance and initialize firebase app with firestore in your code. You can follow steps in [firebase documentation](https://firebase.google.com/docs/firestore/quickstart) to do this.
Then you just need to supply database, collection name and type to `Collection` constructor, the type is optional but highly recommended as it will be used for all operations with the collection.

```typescript
import { getFirestore } from 'firebase/firestore';
import { Collection } from 'typed-firestore';

const db = getFirestore();
const pokemons = new Collection<Pokemon>('pokemon', db);

type Pokemon = {
  name: string;
  type?: string;
};
```

Then you can access all basic CRUD operations:

```typescript
const mewTwoId = await pokemons.create({ name: 'Mewtwo' });
const allPokemons = pokemons.read();
await pokemons.update(mewTwoId, { type: 'psycho' });
await pokemons.delete(mewTwoId);

const unsubscribe = pokemons.subscribe(({ name }) => {
  console.log(name); // This will log all pokemons names every time a pokemon is added/updated/deleted
});
unsubscribe();
```

Note that you are not allowed id for document. Id is automatically assigned by firestore. Unlike in firestore API, when reading data, document data is returned as plain object together with id of that document.

## Deep dive

### Querying data

When reading the data, either with `collection.read` or `collection.subscribe`, you can supply `Query Parameters` object that will be used to filter, limit, and sort your data. `QueryParamaters` type is based on a type of the document in the collection to provide better intellisense.
Example:

```typescript
type Pokemon = {
  pokedexIndex: number;
  name: string;
  types: string[];
  isEvolution: boolean;
};

const allFireTypePokemons = pokemon.read({ where: { types: { contains: 'fire' } } });
const mew = pokemon.read({ where: { name: { is: 'mew' } } });
```
