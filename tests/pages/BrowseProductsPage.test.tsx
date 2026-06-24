import { Theme } from '@radix-ui/themes';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import { server } from '../mocks/server';

describe('BrowseProductsPage', () => {
  const renderComponent = () => {
    render(
      <Theme>
        <BrowseProducts />
      </Theme>,
    );
  };

  it('should show loading skeleton when categories are fetching', () => {
    server.use(
      http.get('/categories', async () => {
        await delay();
        return HttpResponse.json([]);
      }),
    );

    renderComponent();

    expect(
      screen.getByRole('progressbar', { name: /categories/i }),
    ).toBeInTheDocument();
  });

  it('should hide loading skeleton when categories are fetched', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: /categories/i }),
    );
  });

  it('should show loading skeleton when products are fetching', () => {
    server.use(
      http.get('/products', async () => {
        await delay();
        return HttpResponse.json([]);
      }),
    );

    renderComponent();

    expect(
      screen.getByRole('progressbar', { name: /products/i }),
    ).toBeInTheDocument();
  });

  it('should hide loading skeleton when products are fetched', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: /products/i }),
    );
  });
});
