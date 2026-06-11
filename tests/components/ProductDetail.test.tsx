import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import ProductDetail from '../../src/components/ProductDetail';
import { db } from '../mocks/db';
import { server } from '../mocks/server';

describe('ProductDetail', () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { equals: productId } } });
  });

  it('should render an error for invalid product id', () => {
    render(<ProductDetail productId={0} />);

    expect(screen.getByText(/invalid/i)).toBeInTheDocument();
  });

  it('should render message if product not found', async () => {
    server.use(http.get('/products/:id', () => HttpResponse.json(null)));

    render(<ProductDetail productId={1} />);

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it('should render product Detail', async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    render(<ProductDetail productId={productId} />);

    const heading = await screen.findByRole('heading', {
      name: /product detail/i,
    });
    expect(heading).toBeInTheDocument();

    const name = screen.getByText(new RegExp(product!.name));
    expect(name).toBeInTheDocument();

    const price = screen.getByText(new RegExp(product!.price.toString()));
    expect(price).toBeInTheDocument();
  });

  it('should render an error message if data fetching fails', async () => {
    server.use(http.get('/products/:id', () => HttpResponse.error()));

    render(<ProductDetail productId={productId} />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
