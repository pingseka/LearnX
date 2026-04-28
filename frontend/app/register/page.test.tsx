import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from './page';
import { register, saveToken } from '../../api/auth';
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

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ refreshUser: jest.fn().mockResolvedValue(undefined) });
  });

  test('renders registration form with all fields', () => {
    renderWithProviders(<RegisterPage />);
    
    expect(screen.getByLabelText('昵称')).toBeInTheDocument();
    expect(screen.getByLabelText('邮箱')).toBeInTheDocument();
    expect(screen.getByLabelText('密码')).toBeInTheDocument();
    expect(screen.getByLabelText('确认密码')).toBeInTheDocument();
    expect(screen.getByLabelText(/用户协议/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /立即注册/i })).toBeInTheDocument();
  });

  test('shows password strength indicator', () => {
    renderWithProviders(<RegisterPage />);
    
    const passwordInput = screen.getByLabelText('密码');
    
    fireEvent.change(passwordInput, { target: { value: 'testpassword123' } });
    
    const strengthIndicator = screen.getByText(/密码强度/);
    expect(strengthIndicator).toBeInTheDocument();
  });

  test('shows error when passwords do not match', async () => {
    renderWithProviders(<RegisterPage />);
    
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'different' } });
    fireEvent.click(screen.getByRole('button', { name: /立即注册/i }));
    
    await waitFor(() => {
      expect(screen.getByText('两次输入的密码不一致')).toBeInTheDocument();
    });
  });

  test('shows error when terms are not agreed', async () => {
    renderWithProviders(<RegisterPage />);
    
    fireEvent.change(screen.getByLabelText('昵称'), { target: { value: 'TestUser' } });
    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'password123' } });
    
    const button = screen.getByRole('button', { name: /立即注册/i });
    expect(button).toBeDisabled();
    
    expect(screen.getByText('请先勾选并同意用户协议，注册按钮才会启用。')).toBeInTheDocument();
  });

  test('submits form with valid credentials', async () => {
    (register as jest.Mock).mockResolvedValue({ token: 'mock-token' });
    (saveToken as jest.Mock).mockImplementation(() => {});
    
    renderWithProviders(<RegisterPage />);
    
    fireEvent.change(screen.getByLabelText('昵称'), { target: { value: 'TestUser' } });
    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'Password123' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'Password123' } });
    fireEvent.click(screen.getByLabelText(/用户协议/));
    fireEvent.click(screen.getByRole('button', { name: /立即注册/i }));
    
    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({ 
        name: 'TestUser', 
        email: 'test@example.com', 
        password: 'Password123' 
      });
    });
    
    expect(saveToken).toHaveBeenCalledWith('mock-token');
    await waitFor(() => {
      expect(screen.getByText('注册成功')).toBeInTheDocument();
    });
  });

  test('shows error message when registration fails', async () => {
    (register as jest.Mock).mockRejectedValue(new Error('注册失败'));
    
    renderWithProviders(<RegisterPage />);
    
    fireEvent.change(screen.getByLabelText('昵称'), { target: { value: 'TestUser' } });
    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'Password123' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'Password123' } });
    fireEvent.click(screen.getByLabelText(/用户协议/));
    fireEvent.click(screen.getByRole('button', { name: /立即注册/i }));
    
    await waitFor(() => {
      expect(screen.getByText('注册失败')).toBeInTheDocument();
    });
  });

  test('disables submit button when loading', async () => {
    (register as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ token: 'token' }), 1000)));
    
    renderWithProviders(<RegisterPage />);
    
    fireEvent.change(screen.getByLabelText('昵称'), { target: { value: 'TestUser' } });
    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'Password123' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'Password123' } });
    fireEvent.click(screen.getByLabelText(/用户协议/));
    
    const button = screen.getByRole('button', { name: /立即注册/i });
    fireEvent.click(button);
    
    expect(button).toBeDisabled();
    expect(screen.getByText('注册中...')).toBeInTheDocument();
  });

  test('disables submit button when terms are not checked', () => {
    renderWithProviders(<RegisterPage />);
    
    fireEvent.change(screen.getByLabelText('昵称'), { target: { value: 'TestUser' } });
    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'Password123' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'Password123' } });
    
    const button = screen.getByRole('button', { name: /立即注册/i });
    
    expect(button).toBeDisabled();
    
    fireEvent.click(screen.getByLabelText(/用户协议/));
    
    expect(button).not.toBeDisabled();
  });

  test('navigates to login page', () => {
    renderWithProviders(<RegisterPage />);
    
    const loginLink = screen.getByText('立即登录');
    
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});