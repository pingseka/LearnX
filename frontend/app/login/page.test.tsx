import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { login, saveToken } from '../../api/auth';
import { useAuth } from '@/lib/auth-context';
import { Toaster } from 'sonner';

jest.mock('../../api/auth');
jest.mock('@/lib/auth-context');
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <>
      {ui}
      <Toaster />
    </>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ refreshUser: jest.fn().mockResolvedValue(undefined) });
  });

  test('renders login form with email and password fields', () => {
    renderWithProviders(<LoginPage />);
    
    expect(screen.getByLabelText('邮箱')).toBeInTheDocument();
    expect(screen.getByLabelText('密码')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button', { name: /登录/i });
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('shows password when eye icon is clicked', () => {
    renderWithProviders(<LoginPage />);
    
    const passwordInput = screen.getByLabelText('密码');
    const eyeIcon = screen.getByRole('button', { name: '' });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(eyeIcon);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(eyeIcon);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('submits form with valid credentials', async () => {
    (login as jest.Mock).mockResolvedValue({ token: 'mock-token' });
    (saveToken as jest.Mock).mockImplementation(() => {});
    
    renderWithProviders(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'password123' } });
    
    const buttons = screen.getAllByRole('button', { name: /登录/i });
    fireEvent.click(buttons[0]);
    
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    });
    
    expect(saveToken).toHaveBeenCalledWith('mock-token');
    await waitFor(() => {
      expect(screen.getByText('登录成功')).toBeInTheDocument();
    });
  });

  test('shows error message when login fails', async () => {
    (login as jest.Mock).mockRejectedValue(new Error('登录失败'));
    
    renderWithProviders(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'wrongpassword' } });
    
    const buttons = screen.getAllByRole('button', { name: /登录/i });
    fireEvent.click(buttons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('登录失败')).toBeInTheDocument();
    });
  });

  test('disables submit button when loading', async () => {
    (login as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ token: 'token' }), 1000)));
    
    renderWithProviders(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'password123' } });
    
    const buttons = screen.getAllByRole('button', { name: /登录/i });
    const button = buttons[0];
    fireEvent.click(button);
    
    expect(button).toBeDisabled();
    expect(screen.getByText('登录中...')).toBeInTheDocument();
  });

  test('requires email and password fields', () => {
    renderWithProviders(<LoginPage />);
    
    const buttons = screen.getAllByRole('button', { name: /登录/i });
    const submitButton = buttons[0];
    
    fireEvent.click(submitButton);
    
    const emailInput = screen.getByLabelText('邮箱');
    const passwordInput = screen.getByLabelText('密码');
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  test('toggles remember me checkbox', () => {
    renderWithProviders(<LoginPage />);
    
    const checkbox = screen.getByLabelText('记住我');
    
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test('navigates to register page', () => {
    renderWithProviders(<LoginPage />);
    
    const registerLink = screen.getByText('立即注册');
    
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});