import { afterEach, beforeAll } from 'vitest';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

import { projectId } from './utils';

beforeAll(() => {
  initializeApp({ projectId });
  connectFirestoreEmulator(getFirestore(), 'localhost', 8080);
});

afterEach(async () => {
  const url = `http://127.0.0.1:8080/emulator/v1/projects/${projectId}/databases/(default)/documents`;
  await axios.delete(url);
});
