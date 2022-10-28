import { useEffect, useState } from 'react';

import { Collection } from '../core/Collection';
import { FirebaseDocument, WithId } from '../core/typings/FirebaseDocument';
import { QueryParameters } from '../core/typings/QueryParameters';

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
  }, []);

  return documents;
};
