/* eslint-disable @typescript-eslint/unbound-method */
import { faker } from '@faker-js/faker';
import { factory, manyOf, oneOf, primaryKey } from '@mswjs/data';

export const db = factory({
  product: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.productName,
    price: () => faker.number.int({ min: 1, max: 100 }),
    categoryId: faker.number.int,
    category: oneOf('category'),
  },
  category: {
    id: primaryKey(faker.number.int),
    name: faker.company.name,
    products: manyOf('product'),
  },
});

export const getProductsByCategory = (categoryId: number) => {
  return db.product.findMany({
    where: { categoryId: { equals: categoryId } },
  });
};
