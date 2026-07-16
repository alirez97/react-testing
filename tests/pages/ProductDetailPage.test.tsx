import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { db } from '../mocks/db';
import { navigateTo } from '../utils';

describe('ProductDetailPage', () => {
  it('should render product details', async () => {
    const product = db.product.create();

    navigateTo(`/products/${product.id}`);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    expect(
      screen.getByRole('heading', { name: product.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();

    db.product.delete({ where: { id: { equals: product.id } } });
  });
});
