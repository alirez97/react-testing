import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import routes from '../src/routes';

describe('Router', () => {
  it.each([
    { page: 'home', heading: /home/i, route: '/' },
    { page: 'products', heading: /products/i, route: '/products' },
  ])('should render the $page page for $route', ({ heading, route }) => {
    const router = createMemoryRouter(routes, {
      initialEntries: [route],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });
});
