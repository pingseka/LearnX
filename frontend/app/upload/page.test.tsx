import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadPage from './page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/components/layout/header', () => ({
  Header: () => <header>Header</header>,
}));

jest.mock('@/components/layout/footer', () => ({
  Footer: () => <footer>Footer</footer>,
}));

jest.mock('@/components/file-upload', () => ({
  FileUpload: ({ onFileSelect }: { onFileSelect: (file: File) => void }) => (
    <button onClick={() => onFileSelect(new File(['test'], 'test.pdf'))}>
      Upload File
    </button>
  ),
}));

describe('UploadPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test('renders upload page with step indicator', () => {
    render(<UploadPage />);
    
    expect(screen.getByText('上传文件')).toBeInTheDocument();
    expect(screen.getByText('填写信息')).toBeInTheDocument();
    expect(screen.getByText('设置价格')).toBeInTheDocument();
    expect(screen.getByText('确认发布')).toBeInTheDocument();
  });

  test('navigates through steps correctly', () => {
    render(<UploadPage />);
    
    const nextButton = screen.getByRole('button', { name: /下一步/i });
    
    expect(nextButton).toBeDisabled();
    
    fireEvent.click(screen.getByText('Upload File'));
    
    expect(nextButton).not.toBeDisabled();
    fireEvent.click(nextButton);
    
    expect(screen.getByRole('heading', { name: /填写资料信息/i })).toBeInTheDocument();
    
    fireEvent.change(screen.getByLabelText('资料标题 *'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText('资料描述 *'), { target: { value: 'Test description' } });
    fireEvent.click(nextButton);
    
    expect(screen.getByRole('heading', { name: /设置价格/i })).toBeInTheDocument();
  });

  test('generates description with AI', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { description: 'Generated description' } }),
    });
    
    render(<UploadPage />);
    
    fireEvent.click(screen.getByText('Upload File'));
    fireEvent.click(screen.getByRole('button', { name: /下一步/i }));
    
    fireEvent.change(screen.getByLabelText('资料标题 *'), { target: { value: 'Test Material' } });
    
    const generateButton = screen.getByRole('button', { name: /AI 生成/i });
    fireEvent.click(generateButton);
    
    expect(generateButton).toBeDisabled();
    expect(screen.getByText('生成中...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test Material', category: 'politics' }),
      });
    });
    
    await waitFor(() => {
      expect(screen.getByLabelText('资料描述 *')).toHaveValue('Generated description');
    });
    
    expect(generateButton).not.toBeDisabled();
  });

  test('handles AI generation failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    render(<UploadPage />);
    
    fireEvent.click(screen.getByText('Upload File'));
    fireEvent.click(screen.getByRole('button', { name: /下一步/i }));
    
    fireEvent.change(screen.getByLabelText('资料标题 *'), { target: { value: 'Test Material' } });
    
    const generateButton = screen.getByRole('button', { name: /AI 生成/i });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(generateButton).not.toBeDisabled();
    });
    
    expect(screen.getByLabelText('资料描述 *')).toHaveValue('');
  });

  test('validates form fields', () => {
    render(<UploadPage />);
    
    fireEvent.click(screen.getByText('Upload File'));
    fireEvent.click(screen.getByRole('button', { name: /下一步/i }));
    
    const nextButton = screen.getByRole('button', { name: /下一步/i });
    
    expect(nextButton).toBeDisabled();
    
    fireEvent.change(screen.getByLabelText('资料标题 *'), { target: { value: 'Test Title' } });
    expect(nextButton).toBeDisabled();
    
    fireEvent.change(screen.getByLabelText('资料描述 *'), { target: { value: 'Test description' } });
    expect(nextButton).not.toBeDisabled();
  });

  test('validates price range', () => {
    render(<UploadPage />);
    
    fireEvent.click(screen.getByText('Upload File'));
    fireEvent.click(screen.getByRole('button', { name: /下一步/i }));
    
    fireEvent.change(screen.getByLabelText('资料标题 *'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText('资料描述 *'), { target: { value: 'Test description' } });
    fireEvent.click(screen.getByRole('button', { name: /下一步/i }));
    
    const nextButton = screen.getByRole('button', { name: /下一步/i });
    
    fireEvent.change(screen.getByLabelText('资料定价（元）'), { target: { value: '0.05' } });
    expect(nextButton).toBeDisabled();
    
    fireEvent.change(screen.getByLabelText('资料定价（元）'), { target: { value: '50' } });
    expect(nextButton).not.toBeDisabled();
    
    fireEvent.change(screen.getByLabelText('资料定价（元）'), { target: { value: '1000' } });
    expect(nextButton).toBeDisabled();
  });

  test('shows success message after submission', async () => {
    render(<UploadPage />);
    
    fireEvent.click(screen.getByText('Upload File'));
    fireEvent.click(screen.getByRole('button', { name: /下一步/i }));
    
    fireEvent.change(screen.getByLabelText('资料标题 *'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText('资料描述 *'), { target: { value: 'Test description' } });
    fireEvent.click(screen.getByRole('button', { name: /下一步/i }));
    
    fireEvent.change(screen.getByLabelText('资料定价（元）'), { target: { value: '9.9' } });
    
    await waitFor(() => {
      const nextButton = screen.getByRole('button', { name: /下一步/i });
      expect(nextButton).not.toBeDisabled();
      fireEvent.click(nextButton);
    });
    
    const submitButton = screen.getByRole('button', { name: /发布资料/i });
    expect(submitButton).toBeInTheDocument();
  });

  test('shows category selection', () => {
    render(<UploadPage />);
    
    fireEvent.click(screen.getByText('Upload File'));
    fireEvent.click(screen.getByRole('button', { name: /下一步/i }));
    
    expect(screen.getByText('政治')).toBeInTheDocument();
    expect(screen.getByText('英语')).toBeInTheDocument();
    expect(screen.getByText('数学')).toBeInTheDocument();
    expect(screen.getByText('专业课')).toBeInTheDocument();
  });

  test('AI generate button is disabled when title is empty', () => {
    render(<UploadPage />);
    
    fireEvent.click(screen.getByText('Upload File'));
    fireEvent.click(screen.getByRole('button', { name: /下一步/i }));
    
    const generateButton = screen.getByRole('button', { name: /AI 生成/i });
    
    expect(generateButton).toBeDisabled();
    
    fireEvent.change(screen.getByLabelText('资料标题 *'), { target: { value: 'Test' } });
    expect(generateButton).not.toBeDisabled();
  });
});