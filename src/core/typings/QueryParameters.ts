import { FirebaseDocument } from './FirebaseDocument';
import { SortBy } from './SortBy';
import { Where } from './Where';

export type QueryParameters<Document extends FirebaseDocument<Document>> = {
  where?: Where<Document>;
  sortBy?: SortBy<Document> | SortBy<Document>[];
  takeFirst?: number;
  takeLast?: number;
};
