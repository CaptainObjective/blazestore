# Typed Firestore

## Why

Firestore is cool database packed with a lot of features. Sometimes the number of features can be overwhelming and it feels like you have to get PhD in Firestore's docs to perform a simple CRUD operation. The goal of this library is to provide easy-to-use and type-safe API to interact with firestore instance, whilst still leaving the ability to use original API for more advanced use cases.

## What

Typed Firestore is a tiny wrapper around `firebase/firestore` package offering simple interface to do basic operations against firestore instance. Collections and documents created with this package are not special in any way and can be interacted throughout regular `firebase/firestore` API. To get firebase collection reference just use `collection.reference`. All limitations imposed by firestore (e.g.: you cannot filter by two different fields at the same time without composed index) are still applicable.

## How

To use typed firestore first you need to create firestore instance and initialize firebase app with firestore in your code. You can follow steps in [firebase documentation](https://firebase.google.com/docs/firestore/quickstart) to do this.
Then you just need to supply database, collection name and type to `Collection` constructor, the type is optional but highly recommended as it will be used for all operations against that collection.

```typescript
import { getFirestore } from 'firebase/firestore';
import { Collection } from 'typed-firestore';

const db = getFirestore();

type Pokemon = {
  name: string;
  type?: string;
};

const pokemons = new Collection<Pokemon>('pokemon', db);
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
unsubscribe(); // Call it when you do not need data anymore to free precious RAM
```
Unlike in firestore API, when reading data, document is returned as plain object together with id of that document.

Note that you are not allowed to specify id for document. Id is automatically assigned by firestore. If you want to specify id for your document you have to use different property name.

## Deep dive

### Querying data

When reading the data, either with `collection.read` or `collection.subscribe`, you can supply `Query Parameters` object that will be used to filter, limit, and sort your data. `QueryParameters` type is based on a type of the document in the collection to provide better intellisense.

`QueryParameters` type as well as types of its individual components are exported from the library so you can construct object outside of method calls whilst preserving type safety. Keep in mind that these types are generic and require type of a document used in collection.

- Filtering - to filter the data you have to supply `where` object with property name matching property name in document type. Type for property value is based on document type as well. Whenever you are in doubt just hit `ctrl+space` and let typescript intellisense take the wheel.  
If you specify more than one field inside `where` object they will be merged using `AND` logic. Also please keep in mind that you need to first create [composite index](https://firebase.google.com/docs/firestore/query-data/index-overview#composite_indexes) for these fields.

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
- Sorting - to sort the data you have to supply `sortBy` object with property name matching property name in document type and value set to either `Ascending` or `Descending`
  ```typescript
  type Pokemon = {
    pokedexIndex: number;
    name: string;
  };

  await collection.create({ name: 'Ivysaur', pokedexId: 2, });
  await collection.create({ name: 'Venusaur', pokedexId: 3, });
  await collection.create({ name: 'Bulbasaur', pokedexId: 1, });
  const result = await collection.read({ sortBy: { pokedexId: 'Ascending' } });
  result.forEach(({name})=>console.log(name)) // 'Bulbasaur', 'Ivysaur', 'Venusaur'
  ```
- Limits - you can also limit the number of records that are returned from the query by supplying `takeFirst` or `takeLast`.
  ```typescript
  type Pokemon = {
    pokedexIndex: number;
    name: string;
  };

  await collection.create({ name: 'Ivysaur', pokedexId: 2, });
  await collection.create({ name: 'Venusaur', pokedexId: 3, });
  await collection.create({ name: 'Bulbasaur', pokedexId: 1, });
  const [bulbasaur] = await collection.read({ sortBy: { pokedexId: 'Ascending' }, takeFirst: 1 });
  const [venusaur] = await collection.read({ sortBy: { pokedexId: 'Ascending' }, takeLast: 3 });
  ```

### Collection ref

It might happen that your needs exceed capabilities of this library. Should that happen, you can use official firestore API as usual. For your convenience collection has `reference` field that lets you access underlying collection reference.
```typescript
import { query, orderBy, startAt, getDocs, getFirestore } from "firebase/firestore"; 
import { Collection } from 'typed-firestore';

const db = getFirestore();

type Pokemon = {
  name: string;
  pokedexIndex: number;
};

const pokemons = new Collection<Pokemon>('pokemon', db);
const result = await getDocs(query(pokemons.reference, orderBy("pokedexIndex"), startAt(3)));
```

### React

To please React users there is also `useCollection` hook that is tiny wrapper around `collection.subscribe` method. It accepts collection and optionally `QueryParameters` object and returns state variable that changes every time collection is updated (that includes adding, removing and updating document). Subscription will be reset whenever `QueryParameters` change.
```tsx
type Pokemon = {
  name: string;
  pokedexIndex: number;
};

const pokemonsCollection = new Collection<Pokemon>("pokemon", db);
const sortBy = { pokedexIndex: "Ascending" } as const;

const Pokedex = () => {
  const pokemons = useCollection(pokemonsCollection, { sortBy });

  return (
    <ul>
      {pokemons.map(({ pokedexIndex, name }) => (
        <li key={pokedexIndex}>{name}</li>
      ))}
    </ul>
  );
};
``` 

## Running locally

Both test and examples take advantage of [firebase emulators](https://firebase.google.com/docs/emulator-suite). To run either of them locally first you will need to setup emulators on your machine. To do so, please follow [official guide](https://firebase.google.com/docs/emulator-suite/install_and_configure). Once you are done with a setup simply run `pnpm db` from root folder. 