import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Auth from './Auth';
import * as api from '../api/api';

jest.mock('../api/api');

describe('Auth Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<Auth onLogin={mockOnLogin} />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to access your boards')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('switches to signup mode when toggle button is clicked', () => {
    render(<Auth onLogin={mockOnLogin} />);
    
    const toggleButton = screen.getByRole('button', { name: 'Sign Up' });
    fireEvent.click(toggleButton);
    
    expect(screen.getAllByText('Create Account')[0]).toBeInTheDocument();
    expect(screen.getByText('Sign up to get started')).toBeInTheDocument();
  });

  it('switches back to login mode from signup', () => {
    render(<Auth onLogin={mockOnLogin} />);
    
    fireEvent.click(screen.getByText('Sign Up'));
    fireEvent.click(screen.getByText('Sign In'));
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    api.login.mockResolvedValue({ data: { id: 'user123' } });
    
    render(<Auth onLogin={mockOnLogin} />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockOnLogin).toHaveBeenCalledWith('user123');
    });
  });

  it('handles successful signup', async () => {
    api.signup.mockResolvedValue({ data: { id: 'user456' } });
    
    render(<Auth onLogin={mockOnLogin} />);
    
    fireEvent.click(screen.getByText('Sign Up'));
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'newuser@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'newpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    
    await waitFor(() => {
      expect(api.signup).toHaveBeenCalledWith('newuser@example.com', 'newpassword');
      expect(mockOnLogin).toHaveBeenCalledWith('user456');
    });
  });

  it('displays error message on login failure', async () => {
    api.login.mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } },
    });
    
    render(<Auth onLogin={mockOnLogin} />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
    
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('displays generic error message when no response error', async () => {
    api.login.mockRejectedValue(new Error('Network error'));
    
    render(<Auth onLogin={mockOnLogin} />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    await waitFor(() => {
      expect(screen.getByText('Authentication failed. Please try again.')).toBeInTheDocument();
    });
  });

  it('clears error message when switching modes', async () => {
    api.login.mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } },
    });
    
    render(<Auth onLogin={mockOnLogin} />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
    
    // Switch mode
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    await waitFor(() => {
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });

  it('updates email and password inputs', () => {
    render(<Auth onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    fireEvent.change(emailInput, { target: { value: 'new@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'newpass' } });
    
    expect(emailInput.value).toBe('new@email.com');
    expect(passwordInput.value).toBe('newpass');
  });
});
