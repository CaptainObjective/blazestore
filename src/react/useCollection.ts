import { useEffect, useState } from 'react';

import { Collection } from '../core/Collection';
import { FirebaseDocument, WithId } from '../core/typings/FirebaseDocument';
import { QueryParameters } from '../core/typings/QueryParameters';

export const useCollection = <T extends FirebaseDocument>(
  collection: Collection<T>,
  parameters: QueryParameters<T> = {}
) => {
  const [documents, setDocuments] = useState<WithId<T>[]>([]);

  useEffect(() => {
    const unsubscribe = collection.subscribe((documents) => {
      setDocuments(documents);
    }, parameters);

    return () => unsubscribe();
  }, []);

  return documents;
};
