import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import Auth from './components/Auth';
import Boards from './components/Boards';

jest.mock('./components/Auth');
jest.mock('./components/Boards');

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Auth.mockImplementation(({ onLogin }) => (
      <div data-testid="auth">
        <button onClick={() => onLogin('user123')}>Login</button>
      </div>
    ));
    Boards.mockImplementation(({ userId }) => (
      <div data-testid="boards">Boards for {userId}</div>
    ));
  });

  it('renders Auth component when not logged in', () => {
    render(<App />);
    expect(screen.getByTestId('auth')).toBeInTheDocument();
  });

  it('renders Boards component when logged in', () => {
    render(<App />);
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    expect(screen.getByTestId('boards')).toBeInTheDocument();
    expect(screen.getByText('Track Board')).toBeInTheDocument();
  });

  it('shows sign out button when logged in', () => {
    render(<App />);
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('logs out user when sign out button is clicked', () => {
    render(<App />);
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);
    
    expect(screen.getByTestId('auth')).toBeInTheDocument();
    expect(screen.queryByText('Track Board')).not.toBeInTheDocument();
  });
});
