import type { ConditionalKeys, Primitive, RequireExactlyOne } from 'type-fest';

type BooleanQueryOperators = '==' | '!=';
type PrimitivesQueryOperatorsAcceptingPrimitive = '<' | '<=' | '>=' | '>' | BooleanQueryOperators;
type PrimitivesQueryOperatorsAcceptingArray = 'in' | 'not-in';
type ArrayMembershipQueryOperatorsAcceptingPrimitive = 'array-contains';
type ArrayMembershipQueryOperatorsAcceptingArray = 'array-contains-any';

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
export type Where<Document> = Partial<
  Record<GetKeys<Document, boolean>, BooleanFilterField> &
    Record<GetKeys<Document, string>, PrimitiveFilterField<string>> &
    Record<GetKeys<Document, number>, PrimitiveFilterField<number>> &
    Record<GetKeys<Document, string[]>, ArrayFilterField<string>> &
    Record<GetKeys<Document, number[]>, ArrayFilterField<number>>
>;
