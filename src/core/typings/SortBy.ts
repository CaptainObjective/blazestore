import { RequireExactlyOne } from 'type-fest';

export type SortType = 'Ascending' | 'Descending';

type SortField<Document> = RequireExactlyOne<Record<keyof Document, SortType>>;

export type SortBy<Document> = SortField<Document>;
