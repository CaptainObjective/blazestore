import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

initializeApp({ projectId: 'example-react' });
export const db = getFirestore();
connectFirestoreEmulator(db, 'localhost', 8080);
