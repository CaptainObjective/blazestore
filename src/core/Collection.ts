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

class Collection<Document extends FirebaseDocument<Document>> {
  #reference: CollectionReference<Document>;
  #firebaseService: FirebaseService<Document>;

  /**
   * Use it to create object representing firestore collection
   * Ideally you should only need to create one of this in your app
   * @param name this will be name of the collection inside firestore
   * @param db firestore database returned from calling getFirestore() from firebase/firestore
   */
  constructor(public name: string, db: Firestore) {
    this.#firebaseService = new FirebaseService<Document>(name, db);
    this.#reference = this.#firebaseService.reference;
  }

  /**
   * This will create new document inside the collection
   * @param document object that will be stored inside firestore collection
   * @returns @promise of id of newly created document
   */
  async create(document: Document) {
    const { id } = await addDoc<Document>(this.#reference, document);
    return id;
  }

  /**
   * This method allows to read documents inside the collection
   * @param parameters used to filter, sort and limit your query. To read all data from collection simply skip this param
   * @returns @promise of documents from the collection
   */
  async read(parameters: QueryParameters<Document> = {}) {
    const snapshots = await getDocs<Document>(this.#firebaseService.getQuery(parameters));
    const documents = this.#firebaseService.mapQuerySnapshotsToDocumentsWithId(snapshots);

    return documents;
  }

  /**
   * This method will update document inside the collection.
   * It does not support upsert, method will fail if given id does not exists
   * @param id of the document to be updated
   * @param document That will be merged with existing document.
   * Fields that are specified in this object will overwrite corresponding fields inside document
   * Omitting some fields will NOT remove fields in the document
   * @returns promise that will be resolved when update is finished
   */
  async update(id: Id, document: UpdateData<Document>) {
    await updateDoc<Document>(this.#firebaseService.getDocumentReference(id), document);
    return;
  }

  /**
   * This method will remove document from the collection.
   * @param id of the document to be deleted
   * @returns promise that will be resolved when deletion is finished
   */
  async delete(id: Id) {
    await deleteDoc(this.#firebaseService.getDocumentReference(id));
    return;
  }

  /**
   * This lets you subscribe to any updates done to the collection
   * @param callback that will be called each time a document is added, updated or removed from collection
   * @param parameters used to filter, sort and limit your query. To subscribe to all data from collection simply skip this param
   * @returns unsubscribe function that should be called when subscription is no longer needed
   */
  subscribe(callback: (document: WithId<Document>[]) => void, parameters: QueryParameters<Document> = {}) {
    return onSnapshot(this.#firebaseService.getQuery(parameters), (snapshots) => {
      const documents = this.#firebaseService.mapQuerySnapshotsToDocumentsWithId(snapshots);
      callback(documents);
    });
  }

  /**
   * Use this to access underlying firestore collection object.
   * This can be used with all functions supplied by firebase/firestore
   * Use it for any cases not covered by this library
   */
  get reference() {
    return this.#reference;
  }
}

export { Collection };
