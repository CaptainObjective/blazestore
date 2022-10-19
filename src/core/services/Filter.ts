import { QueryConstraint, where, WhereFilterOp } from 'firebase/firestore';
import { FirebaseDocument } from '../typings/FirebaseDocument';
import { QueryOperators, Where } from '../typings/Where';

type FilterObject = Record<QueryOperators, boolean | string | number | string[] | number[]>;

type QueryOperatorMap = ReadonlyMap<string, WhereFilterOp>;
const queryOperatorMap: QueryOperatorMap = new Map([
  ['is', '=='],
  ['isNot', '!='],
  ['lessThan', '<'],
  ['lessOrEqualTo', '<='],
  ['greaterOrEqualTo', '>='],
  ['greaterThan', '>'],
  ['in', 'in'],
  ['notIn', 'not-in'],
  ['contains', 'array-contains'],
  ['containsAny', 'array-contains-any'],
]);

class FilterService<Document extends FirebaseDocument> {
  public convertFilterToConstraint(filters: Where<Document> = {}): QueryConstraint[] {
    const queryConstraints: QueryConstraint[] = [];

    for (const [fieldName, filter] of Object.entries(filters as Record<string, FilterObject>)) {
      for (const [operator, value] of Object.entries(filter)) {
        const firebaseOperator = queryOperatorMap.get(operator);
        if (!firebaseOperator) continue;

        queryConstraints.push(where(fieldName, firebaseOperator, value));
      }
    }

    return queryConstraints;
  }
}

export { FilterService };
