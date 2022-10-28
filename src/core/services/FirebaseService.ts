import { Firestore, CollectionReference, query, doc, QuerySnapshot, collection } from 'firebase/firestore';
import { FirebaseDocument, Id, WithId } from '../typings/FirebaseDocument';
import { QueryParameters } from '../typings/QueryParameters';
import { QueryParametersService } from './QueryParameters';

class FirebaseService<Document extends FirebaseDocument<Document>> {
  public reference: CollectionReference<Document>;
  private queryParametersService: QueryParametersService<Document>;

  constructor(name: string, db: Firestore) {
    this.queryParametersService = new QueryParametersService<Document>();
    this.reference = collection(db, name) as CollectionReference<Document>;
  }

  getQuery(parameters: QueryParameters<Document> = {}) {
    const constraints = this.queryParametersService.mapQueryParametersToConstraints(parameters);
    return query(this.reference, ...constraints);
  }

  getDocumentReference(id: Id) {
    return doc<Document>(this.reference, id);
  }

  mapQuerySnapshotsToDocumentsWithId(snapshots: QuerySnapshot<Document>) {
    const documents: WithId<Document>[] = [];
    snapshots.forEach((document) => documents.push({ ...document.data(), id: document.id }));
    return documents;
  }
}

export { FirebaseService };
