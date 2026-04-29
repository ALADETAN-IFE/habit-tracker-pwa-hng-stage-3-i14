// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SignupForm from '../../src/components/auth/SignupForm';
import LoginForm from '../../src/components/auth/LoginForm';
import { USERS_KEY, SESSION_KEY } from '../../src/lib/constants';
import { User } from '../../src/types/auth';

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn() }) }));

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('submits the signup form and creates a session', async () => {
    render(<SignupForm />);
    const email = screen.getByTestId('auth-signup-email') as HTMLInputElement;
    const password = screen.getByTestId('auth-signup-password') as HTMLInputElement;
    const submit = screen.getByTestId('auth-signup-submit');

    fireEvent.change(email, { target: { value: 'test@example.com' } });
    fireEvent.change(password, { target: { value: 'password123' } });
    fireEvent.click(submit);

    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

    expect(session).toBeTruthy();
    expect(session.email).toBe('test@example.com');
    expect(users.find((u: User) => u.email === 'test@example.com')).toBeTruthy();
  });

  it('shows an error for duplicate signup email', async () => {
    localStorage.setItem(USERS_KEY, JSON.stringify([{ id: '1', email: 'dup@example.com', password: 'x', createdAt: new Date().toISOString() }]));
    render(<SignupForm />);
    const email = screen.getByTestId('auth-signup-email') as HTMLInputElement;
    const password = screen.getByTestId('auth-signup-password') as HTMLInputElement;
    const submit = screen.getByTestId('auth-signup-submit');

    fireEvent.change(email, { target: { value: 'dup@example.com' } });
    fireEvent.change(password, { target: { value: 'password' } });
    fireEvent.click(submit);

    expect(await screen.findByText('User already exists')).toBeTruthy();
  });

  it('submits the login form and stores the active session', async () => {
    const user = { id: 'u1', email: 'me@ex.com', password: 'pw', createdAt: new Date().toISOString() };
    localStorage.setItem(USERS_KEY, JSON.stringify([user]));
    render(<LoginForm />);
    const email = screen.getByTestId('auth-login-email') as HTMLInputElement;
    const password = screen.getByTestId('auth-login-password') as HTMLInputElement;
    const submit = screen.getByTestId('auth-login-submit');

    fireEvent.change(email, { target: { value: 'me@ex.com' } });
    fireEvent.change(password, { target: { value: 'pw' } });
    fireEvent.click(submit);

    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    expect(session).toBeTruthy();
    expect(session.email).toBe('me@ex.com');
  });

  it('shows an error for invalid login credentials', async () => {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
    render(<LoginForm />);
    const email = screen.getByTestId('auth-login-email') as HTMLInputElement;
    const password = screen.getByTestId('auth-login-password') as HTMLInputElement;
    const submit = screen.getByTestId('auth-login-submit');

    fireEvent.change(email, { target: { value: 'noone@ex.com' } });
    fireEvent.change(password, { target: { value: 'bad' } });
    fireEvent.click(submit);

    expect(await screen.findByText('Invalid email or password')).toBeTruthy();
  });
});
