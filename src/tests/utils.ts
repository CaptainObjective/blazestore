import { addDoc, CollectionReference, DocumentData, getDocs, getFirestore } from 'firebase/firestore';

export const projectId = 'test-project';

export const db = getFirestore;

export const readDocuments = async (reference: CollectionReference) => {
  const snapshot = await getDocs(reference);

  const result: DocumentData[] = [];
  snapshot.forEach((doc) => {
    result.push(doc.data());
  });

  return result;
};

export const addDocument = (reference: CollectionReference, document: unknown) => addDoc(reference, document);
