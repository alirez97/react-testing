import { db } from '../mocks/db';

describe('group', () => {
  it('should', () => {
    db.product.create();
    db.product.create();
    console.log(db.product.getAll());
  });
});
