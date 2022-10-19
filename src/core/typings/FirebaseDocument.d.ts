export type Id = string;
export type FirebaseDocument = Omit<Record<string, unknown>, 'id'>;
export type WithId<T = FirebaseDocument> = T & { id: Id };
