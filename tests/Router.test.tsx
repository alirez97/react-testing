import { screen } from '@testing-library/react';
import { db } from './mocks/db';
import { navigateTo } from './utils';

describe('Router', () => {
  it.each([
    { page: 'home', heading: /home/i, path: '/' },
    { page: 'products', heading: /products/i, path: '/products' },
  ])('should render the $page page for $path', ({ heading, path }) => {
    navigateTo(path);

    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });

  it('should render the product details page for /products/:id', async () => {
    const product = db.product.create();

    navigateTo('/products/' + product.id);

    expect(
      await screen.findByRole('heading', { name: product.name }),
    ).toBeInTheDocument();

    db.product.delete({ where: { id: { equals: product.id } } });
  });
});
