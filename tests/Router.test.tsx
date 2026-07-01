import { screen } from '@testing-library/react';
import { navigateTo } from './utils';

describe('Router', () => {
  it.each([
    { page: 'home', heading: /home/i, path: '/' },
    { page: 'products', heading: /products/i, path: '/products' },
  ])('should render the $page page for $path', ({ heading, path }) => {
    navigateTo(path);

    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });
});
