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

    const user = userEvent.setup();

    const getAddToCartButton = () =>
      screen.queryByRole('button', { name: /add to cart/i });

    const getQuantityControls = () => ({
      quantity: screen.queryByRole('status'),
      incrementButton: screen.queryByRole('button', { name: '+' }),
      decrementButton: screen.queryByRole('button', { name: '-' }),
    });

    const addToCart = async () => {
      await user.click(getAddToCartButton()!);
    };

    const increaseQuantity = async () => {
      const { incrementButton } = getQuantityControls();
      await user.click(incrementButton!);
    };

    const decreaseQuantity = async () => {
      const { decrementButton } = getQuantityControls();
      await user.click(decrementButton!);
    };

    return {
      getAddToCartButton,
      getQuantityControls,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
    };
  };

  it('should render the Add to Cart button', () => {
    const { getAddToCartButton } = renderComponent();

    expect(getAddToCartButton());
  });

  it('should add the product to cart', async () => {
    const { getAddToCartButton, getQuantityControls, addToCart } =
      renderComponent();

    await addToCart();

    const { quantity, incrementButton, decrementButton } =
      getQuantityControls();
    expect(quantity).toHaveTextContent('1');
    expect(incrementButton).toBeInTheDocument();
    expect(decrementButton).toBeInTheDocument();
    expect(getAddToCartButton()).not.toBeInTheDocument();
  });

  it('should increment the quantity', async () => {
    const { getQuantityControls, addToCart, increaseQuantity } =
      renderComponent();
    await addToCart();

    await increaseQuantity();

    const { quantity } = getQuantityControls();
    expect(quantity).toHaveTextContent('2');
  });

  it('should decrement the quantity', async () => {
    const {
      getQuantityControls,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
    } = renderComponent();
    await addToCart();
    await increaseQuantity();

    await decreaseQuantity();

    const { quantity } = getQuantityControls();
    expect(quantity).toHaveTextContent('1');
  });

  it('should remove the product from the cart', async () => {
    const {
      getAddToCartButton,
      getQuantityControls,
      addToCart,
      decreaseQuantity,
    } = renderComponent();
    await addToCart();

    await decreaseQuantity();

    const { quantity, incrementButton, decrementButton } =
      getQuantityControls();
    expect(quantity).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(getAddToCartButton()).toBeInTheDocument();
  });
});
