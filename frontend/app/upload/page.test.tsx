import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadPage from './page';
import { createMaterial } from '@/api/materials';

const mockUploadFile = new File(['test'], '考研政治笔记.pdf', {
  type: 'application/pdf',
});

jest.mock('@/api/materials', () => ({
  createMaterial: jest.fn(),
}));

jest.mock('@/components/layout/header', () => ({
  Header: () => <header>Header</header>,
}));

jest.mock('@/components/layout/footer', () => ({
  Footer: () => <footer>Footer</footer>,
}));

jest.mock('@/components/file-upload', () => ({
  FileUpload: ({
    onFileSelect,
  }: {
    onFileSelect: (file: File | null) => void;
  }) => (
    <button type="button" onClick={() => onFileSelect(mockUploadFile)}>
      Upload File
    </button>
  ),
}));

function uploadAndGoToInfo() {
  fireEvent.click(screen.getByText('Upload File'));
  fireEvent.click(screen.getByRole('button', { name: /下一步/i }));
}

function fillInfoAndGoToPrice() {
  fireEvent.change(screen.getByLabelText('资料标题 *'), {
    target: { value: '2026考研政治马原核心笔记' },
  });
  fireEvent.change(screen.getByLabelText('资料描述 *'), {
    target: { value: '覆盖马原核心考点和冲刺背诵框架' },
  });
  ['马原', '冲刺', '背诵'].forEach((tag) => {
    fireEvent.change(screen.getByLabelText('标签'), {
      target: { value: tag },
    });
    fireEvent.click(screen.getByRole('button', { name: '添加' }));
  });
  fireEvent.click(screen.getByRole('button', { name: /下一步/i }));
}

function goToConfirmStep() {
  uploadAndGoToInfo();
  fillInfoAndGoToPrice();
  fireEvent.change(screen.getByLabelText('资料定价（元）'), {
    target: { value: '19.9' },
  });
  fireEvent.click(screen.getByRole('button', { name: /下一步/i }));
}

describe('UploadPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test('renders professional Chinese publishing workflow', () => {
    render(<UploadPage />);

    expect(screen.getByText('发布考研资料')).toBeInTheDocument();
    expect(screen.getAllByText('文件').length).toBeGreaterThan(0);
    expect(screen.getByText('信息')).toBeInTheDocument();
    expect(screen.getAllByText('定价').length).toBeGreaterThan(0);
    expect(screen.getByText('确认')).toBeInTheDocument();
    expect(screen.getByText('审核规则')).toBeInTheDocument();
    expect(screen.getByText('发布预览')).toBeInTheDocument();
  });

  test('requires file before moving to material info step', () => {
    render(<UploadPage />);

    const nextButton = screen.getByRole('button', { name: /下一步/i });
    expect(nextButton).toBeDisabled();

    fireEvent.click(screen.getByText('Upload File'));
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(nextButton);
    expect(
      screen.getByRole('heading', { name: /完善资料信息/i })
    ).toBeInTheDocument();
  });

  test('validates title and description before pricing step', () => {
    render(<UploadPage />);
    uploadAndGoToInfo();

    const nextButton = screen.getByRole('button', { name: /下一步/i });
    expect(nextButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText('资料标题 *'), {
      target: { value: '2026考研政治马原核心笔记' },
    });
    expect(nextButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText('资料描述 *'), {
      target: { value: '覆盖马原核心考点和冲刺背诵框架' },
    });
    expect(nextButton).not.toBeDisabled();
  });

  test('generates description from AI service', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: { description: 'AI 生成的资料描述' },
        }),
    });

    render(<UploadPage />);
    uploadAndGoToInfo();

    fireEvent.change(screen.getByLabelText('资料标题 *'), {
      target: { value: '2026考研政治马原核心笔记' },
    });
    fireEvent.click(screen.getByRole('button', { name: /AI 生成/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/ai/generate-description',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: '2026考研政治马原核心笔记',
            category: 'politics',
          }),
        }
      );
    });

    await waitFor(() => {
      expect(screen.getByLabelText('资料描述 *')).toHaveValue(
        'AI 生成的资料描述'
      );
    });
  });

  test('uses local description when AI generation fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('网络失败'));

    render(<UploadPage />);
    uploadAndGoToInfo();

    fireEvent.change(screen.getByLabelText('资料标题 *'), {
      target: { value: '2026考研政治马原核心笔记' },
    });
    fireEvent.click(screen.getByRole('button', { name: /AI 生成/i }));

    await waitFor(() => {
      const description = screen.getByLabelText(
        '资料描述 *'
      ) as HTMLTextAreaElement;
      expect(description.value).toContain('2026考研政治马原核心笔记');
    });
    expect(screen.getByText('网络失败')).toBeInTheDocument();
  });

  test('validates price range before confirm step', () => {
    render(<UploadPage />);
    uploadAndGoToInfo();
    fillInfoAndGoToPrice();

    const nextButton = screen.getByRole('button', { name: /下一步/i });

    fireEvent.change(screen.getByLabelText('资料定价（元）'), {
      target: { value: '0.05' },
    });
    expect(nextButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText('资料定价（元）'), {
      target: { value: '50' },
    });
    expect(nextButton).not.toBeDisabled();

    fireEvent.change(screen.getByLabelText('资料定价（元）'), {
      target: { value: '1000' },
    });
    expect(nextButton).toBeDisabled();
  });

  test('shows sandbox income preview', () => {
    render(<UploadPage />);
    uploadAndGoToInfo();
    fillInfoAndGoToPrice();

    fireEvent.change(screen.getByLabelText('资料定价（元）'), {
      target: { value: '19.9' },
    });

    expect(screen.getAllByText('¥19.90').length).toBeGreaterThan(0);
    expect(screen.getByText('¥1.99')).toBeInTheDocument();
    expect(screen.getAllByText('¥17.91').length).toBeGreaterThan(0);
  });

  test('submits material to backend upload API', async () => {
    (createMaterial as jest.Mock).mockResolvedValue({ id: 1 });

    render(<UploadPage />);
    goToConfirmStep();

    const submitButton = screen.getByRole('button', { name: /提交审核/i });
    expect(submitButton).toBeDisabled();

    fireEvent.click(screen.getByLabelText(/我确认拥有该资料/));
    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createMaterial).toHaveBeenCalledWith({
        title: '2026考研政治马原核心笔记',
        description: '覆盖马原核心考点和冲刺背诵框架',
        category: 'politics',
        price: 19.9,
        tags: ['马原', '冲刺', '背诵'],
        file: mockUploadFile,
      });
    });

    await waitFor(() => {
      expect(screen.getByText('资料已提交审核')).toBeInTheDocument();
    });
  });

  test('shows submit error when backend upload fails', async () => {
    (createMaterial as jest.Mock).mockRejectedValue(new Error('请先登录'));

    render(<UploadPage />);
    goToConfirmStep();

    fireEvent.click(screen.getByLabelText(/我确认拥有该资料/));
    fireEvent.click(screen.getByRole('button', { name: /提交审核/i }));

    await waitFor(() => {
      expect(screen.getByText('请先登录')).toBeInTheDocument();
    });
  });
});
