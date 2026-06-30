import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuantitySelector from '../../src/components/QuantitySelector';
import { Product } from '../../src/entities';
import AllProviders from '../AllProviders';

describe('QuantitySelector', () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      categoryId: 1,
      name: 'a',
      price: 10,
    };

    render(<QuantitySelector product={product} />, { wrapper: AllProviders });

    return {
      getAddToCartButton: () =>
        screen.queryByRole('button', { name: /add to cart/i }),
      getQuantityControls: () => ({
        quantity: screen.queryByRole('status'),
        incrementButton: screen.queryByRole('button', { name: '+' }),
        decrementButton: screen.queryByRole('button', { name: '-' }),
      }),
      user: userEvent.setup(),
    };
  };

  it('should render the Add to Cart button', () => {
    const { getAddToCartButton } = renderComponent();

    expect(getAddToCartButton());
  });

  it('should add the product to cart', async () => {
    const { getAddToCartButton, user, getQuantityControls } = renderComponent();

    await user.click(getAddToCartButton()!);

    const { quantity, incrementButton, decrementButton } =
      getQuantityControls();
    expect(quantity).toHaveTextContent('1');
    expect(incrementButton).toBeInTheDocument();
    expect(decrementButton).toBeInTheDocument();
    expect(getAddToCartButton()).not.toBeInTheDocument();
  });

  it('should increment the quantity', async () => {
    const { getAddToCartButton, getQuantityControls, user } = renderComponent();
    await user.click(getAddToCartButton()!);

    const { quantity, incrementButton } = getQuantityControls();
    await user.click(incrementButton!);

    expect(quantity).toHaveTextContent('2');
  });

  it('should decrement the quantity', async () => {
    const { getAddToCartButton, getQuantityControls, user } = renderComponent();
    await user.click(getAddToCartButton()!);
    const { quantity, incrementButton, decrementButton } =
      getQuantityControls();
    await user.click(incrementButton!);

    await user.click(decrementButton!);

    expect(quantity).toHaveTextContent('1');
  });

  it('should remove the product from the cart', async () => {
    const { getAddToCartButton, getQuantityControls, user } = renderComponent();
    await user.click(getAddToCartButton()!);
    const { quantity, decrementButton } = getQuantityControls();

    await user.click(decrementButton!);

    expect(quantity).not.toBeInTheDocument();
    expect(getAddToCartButton()).toBeInTheDocument();
  });
});
