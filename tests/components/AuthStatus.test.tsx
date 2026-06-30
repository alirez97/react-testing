import { render, screen } from '@testing-library/react';
import AuthStatus from '../../src/components/AuthStatus';
import { mockAuthState } from '../utils';

describe('AuthStatus', () => {
  it('should render the login button if the user is not authenticated', () => {
    mockAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
    });

    render(<AuthStatus />);

    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /log out/i }),
    ).not.toBeInTheDocument();
  });

  it('should render the user name if authenticated', () => {
    mockAuthState({
      isAuthenticated: true,
      isLoading: false,
      user: { name: 'Alireza' },
    });

    render(<AuthStatus />);

    expect(screen.getByText(/alireza/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /log out/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /log in/i }),
    ).not.toBeInTheDocument();
  });

  it('should render the loading message while fetching the auth status', () => {
    mockAuthState({
      isAuthenticated: false,
      isLoading: true,
      user: undefined,
    });

    render(<AuthStatus />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
