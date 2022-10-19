import { orderBy, OrderByDirection } from 'firebase/firestore';
import { SortBy, SortType } from '../typings/SortBy';

const sortToDirectionMapping: Record<SortType, OrderByDirection> = {
  Ascending: 'asc',
  Descending: 'desc',
};

class OrderService<Document> {
  convertOrderToConstraint(sortBy?: SortBy<Document> | SortBy<Document>[]) {
    if (!sortBy) return [];

    const constraints = Array.isArray(sortBy) ? sortBy : [sortBy];
    return constraints.map((sortField) => {
      const [fieldName, sortType] = Object.entries<SortType>(sortField)[0];
      return orderBy(fieldName, sortToDirectionMapping[sortType]);
    });
  }
}

export { OrderService };
