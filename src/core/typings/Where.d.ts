import type { ConditionalKeys, Primitive, RequireExactlyOne } from 'type-fest';
import { FirebaseDocument } from './FirebaseDocument';

type BooleanQueryOperators = 'is' | 'isNot';
type PrimitivesQueryOperatorsAcceptingPrimitive =
  | 'lessThan'
  | 'lessOrEqualTo'
  | 'greaterOrEqualTo'
  | 'greaterThan'
  | BooleanQueryOperators;
type PrimitivesQueryOperatorsAcceptingArray = 'in' | 'notIn';
type ArrayMembershipQueryOperatorsAcceptingPrimitive = 'contains';
type ArrayMembershipQueryOperatorsAcceptingArray = 'containsAny';

type PrimitivesQueryOperators = PrimitivesQueryOperatorsAcceptingPrimitive | PrimitivesQueryOperatorsAcceptingArray;

type ArrayMembershipQueryOperators =
  | ArrayMembershipQueryOperatorsAcceptingPrimitive
  | ArrayMembershipQueryOperatorsAcceptingArray;

export type QueryOperators = PrimitivesQueryOperators | ArrayMembershipQueryOperators;

type GetKeys<Document, FieldType> = ConditionalKeys<Document, FieldType>;

type PrimitiveFilterField<Type extends Primitive> = RequireExactlyOne<
  Record<PrimitivesQueryOperatorsAcceptingPrimitive, Type> & Record<PrimitivesQueryOperatorsAcceptingArray, Type[]>
>;

type BooleanFilterField = Record<BooleanQueryOperators, boolean>;

type ArrayFilterField<Type extends Primitive> = RequireExactlyOne<
  Record<ArrayMembershipQueryOperatorsAcceptingPrimitive, Type> &
    Record<ArrayMembershipQueryOperatorsAcceptingArray, Type[]>
>;
export type Where<Document extends FirebaseDocument> = Partial<
  Record<GetKeys<Document, boolean>, BooleanFilterField> &
    Record<GetKeys<Document, string>, PrimitiveFilterField<string>> &
    Record<GetKeys<Document, number>, PrimitiveFilterField<number>> &
    Record<GetKeys<Document, string[]>, ArrayFilterField<string>> &
    Record<GetKeys<Document, number[]>, ArrayFilterField<number>>
>;
