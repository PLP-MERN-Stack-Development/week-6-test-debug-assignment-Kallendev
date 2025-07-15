import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BugForm from '../../components/BugForm.jsx';

const queryClient = new QueryClient();

const renderWithQueryClient = (component) =>
  render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );

describe('BugForm Unit Tests', () => {
  const mockOnBugCreated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders form elements correctly', () => {
    renderWithQueryClient(<BugForm onBugCreated={mockOnBugCreated} />);

    expect(screen.getByLabelText('Bug Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Bug Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Report Bug/i })).toBeInTheDocument();
  });

  it('validates input before submission', () => {
    renderWithQueryClient(<BugForm onBugCreated={mockOnBugCreated} />);

    fireEvent.change(screen.getByLabelText('Bug Title'), {
      target: { value: 'T' },
    });
    fireEvent.change(screen.getByLabelText('Bug Description'), {
      target: { value: 'Short' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Report Bug/i }));

    expect(screen.getByText(/Title must be at least 3 characters/)).toBeInTheDocument();
  });
});