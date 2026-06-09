import { Theme } from '@radix-ui/themes';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderStatusSelector from '../../src/components/OrderStatusSelector';

describe('OrderStatusSelector', () => {
  const renderComponent = () => {
    const onChange = vi.fn();

    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>,
    );

    return {
      trigger: screen.getByRole('combobox'),
      getOptions: () => screen.findAllByRole('option'),
      getOption: (label: RegExp) =>
        screen.findByRole('option', { name: label }),
      user: userEvent.setup(),
      onChange,
    };
  };

  it("should render 'New' as the default value", () => {
    const { trigger } = renderComponent();

    expect(trigger).toHaveTextContent('New');
  });

  it('should render correct statuses', async () => {
    const { trigger, getOptions, user } = renderComponent();

    await user.click(trigger);

    const options = await getOptions();
    expect(options).toHaveLength(3);
    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(['New', 'Processed', 'Fulfilled']);
  });

  it.each([
    [/processed/i, 'processed'],
    [/fulfilled/i, 'fulfilled'],
  ])('should call onChange with "$1" when clicked', async (label, value) => {
    const { onChange, trigger, user, getOption } = renderComponent();
    await user.click(trigger);

    const option = await getOption(label);
    await user.click(option);

    expect(onChange).toHaveBeenCalledWith(value);
  });

  it('should call onChange with "New" when clicked', async () => {
    const { onChange, trigger, user, getOption } = renderComponent();

    await user.click(trigger);
    const processedOption = await getOption(/processed/i);
    await user.click(processedOption);

    await user.click(trigger);
    const newOption = await getOption(/new/i);
    await user.click(newOption);

    expect(onChange).toHaveBeenCalledWith('new');
  });
});
