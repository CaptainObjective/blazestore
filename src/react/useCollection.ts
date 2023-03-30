import { useEffect, useState } from 'react';

import { Collection } from '../core/Collection';
import { FirebaseDocument, WithId } from '../core/typings/FirebaseDocument';
import { QueryParameters } from '../core/typings/QueryParameters';

/**
 * This hook lets you subscribe to document updates in the collection
 * @param collection to subscribe to
 * @param parameters that will be passed to collection.subscribe call
 * @returns react state variable holding documents returned by subscription call
 * it will automatically update (triggering rerender) each time document inside the collection is added/updated/deleted
 */
export const useCollection = <Document extends FirebaseDocument<Document>>(
  collection: Collection<Document>,
  parameters: QueryParameters<Document> = {}
) => {
  const [documents, setDocuments] = useState<WithId<Document>[]>([]);

  useEffect(() => {
    const unsubscribe = collection.subscribe((documents) => {
      setDocuments(documents);
    }, parameters);

    return () => unsubscribe();
  }, [JSON.stringify(parameters)]);

  return documents;
};
