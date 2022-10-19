import { QueryConstraint } from 'firebase/firestore';

import { FirebaseDocument } from '../typings/FirebaseDocument';
import { QueryParameters } from '../typings/QueryParameters';
import { FilterService } from './Filter';
import { LimitService } from './Limit';
import { OrderService } from './Order';

class QueryParametersService<Document extends FirebaseDocument> {
  private filterService: FilterService<Document> = new FilterService<Document>();
  private orderService: OrderService<Document> = new OrderService<Document>();
  private limitService: LimitService = new LimitService();

  mapQueryParametersToConstraints(parameters: QueryParameters<Document>): QueryConstraint[] {
    const filterConstraints = this.filterService.convertFilterToConstraint(parameters.where);
    const orderConstraints = this.orderService.convertOrderToConstraint(parameters.sortBy);
    const limitConstraints = this.limitService.convertLimitToConstraint(parameters.takeFirst, parameters.takeLast);

    return [...filterConstraints, ...orderConstraints, ...limitConstraints];
  }
}

export { QueryParametersService };
