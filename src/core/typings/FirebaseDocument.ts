export type Id = string;
export type FirebaseDocument<Document> = {
  [Key in keyof Document]: Key extends 'id' ? never : Document[Key];
};
export type WithId<Document> = Document & { id: Id };
