import {
  Firestore,
  CollectionReference,
  addDoc,
  getDocs,
  updateDoc,
  UpdateData,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

import { FirebaseService } from './services';
import { FirebaseDocument, Id, WithId } from './typings/FirebaseDocument';
import { QueryParameters } from './typings/QueryParameters';

class Collection<Document extends FirebaseDocument> {
  public reference: CollectionReference<Document>;
  private firebaseService: FirebaseService<Document>;

  constructor(public name: string, db: Firestore) {
    this.firebaseService = new FirebaseService<Document>(name, db);
    this.reference = this.firebaseService.reference;
  }

  async create(document: Document) {
    const { id } = await addDoc<Document>(this.reference, document);
    return id;
  }

  async read(parameters: QueryParameters<Document> = {}) {
    const snapshots = await getDocs<Document>(this.firebaseService.getQuery(parameters));
    const documents = this.firebaseService.mapQuerySnapshotsToDocumentsWithId(snapshots);

    return documents;
  }

  async update(id: Id, document: UpdateData<Document>) {
    return updateDoc<Document>(this.firebaseService.getDocumentReference(id), document);
  }

  async delete(id: Id) {
    return deleteDoc(this.firebaseService.getDocumentReference(id));
  }

  subscribe(callback: (document: WithId<Document>[]) => void, parameters: QueryParameters<Document> = {}) {
    return onSnapshot(this.firebaseService.getQuery(parameters), (snapshots) => {
      const documents = this.firebaseService.mapQuerySnapshotsToDocumentsWithId(snapshots);
      callback(documents);
    });
  }
}

export { Collection };
