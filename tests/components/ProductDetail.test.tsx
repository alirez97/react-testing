import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import ProductDetail from '../../src/components/ProductDetail';
import { products } from '../mocks/data';
import { server } from '../mocks/server';

describe('ProductDetail', () => {
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
    const [product] = products;

    render(<ProductDetail productId={product.id} />);

    const heading = await screen.findByRole('heading', {
      name: /product detail/i,
    });
    expect(heading).toBeInTheDocument();

    const name = screen.getByText(new RegExp(product.name));
    expect(name).toBeInTheDocument();

    const price = screen.getByText(new RegExp(product.price.toString()));
    expect(price).toBeInTheDocument();
  });
});
