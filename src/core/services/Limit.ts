import { limit, limitToLast } from 'firebase/firestore';

class LimitService {
  convertLimitToConstraint(takeFirst?: number, takeLast?: number) {
    if (takeFirst) return [limit(takeFirst)];
    if (takeLast) return [limitToLast(takeLast)];
    return [];
  }
}

export { LimitService };
