import { QueryConstraint, where, WhereFilterOp } from 'firebase/firestore';
import { QueryOperators, Where } from '../typings/Where';

type FilterObject = Record<QueryOperators, boolean | string | number | string[] | number[]>;

class FilterService<Document> {
  public convertFilterToConstraint(filters: Where<Document> = {}): QueryConstraint[] {
    const queryConstraints: QueryConstraint[] = [];
    for (const [fieldName, filter] of Object.entries(filters)) {
      for (const [operator, value] of Object.entries(filter as FilterObject)) {
        queryConstraints.push(where(fieldName, operator as WhereFilterOp, value));
      }
    }

    return queryConstraints;
  }
}

export { FilterService };
