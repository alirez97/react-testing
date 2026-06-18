import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import ProductDetail from '../../src/components/ProductDetail';
import AllProviders from '../AllProviders';
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
    render(<ProductDetail productId={0} />, { wrapper: AllProviders });

    expect(screen.getByText(/invalid/i)).toBeInTheDocument();
  });

  it('should render message if product not found', async () => {
    server.use(http.get('/products/:id', () => HttpResponse.json(null)));

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it('should render product Detail', async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

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

    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('should render a loading indicator when fetching data', async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    server.use(
      http.get('/products/:id', async () => {
        await delay();
        return HttpResponse.json(product);
      }),
    );

    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it('should remove loading indicator after data is fetched', async () => {
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it('should remove loading indicator if data fetching fails', async () => {
    server.use(http.get('/products/:id', () => HttpResponse.error()));

    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
