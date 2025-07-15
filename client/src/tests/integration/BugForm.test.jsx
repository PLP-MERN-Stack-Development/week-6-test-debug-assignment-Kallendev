import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import BugForm from '../../components/BugForm.jsx';

const server = setupServer();

const queryClient = new QueryClient();

const renderWithQueryClient = (component) =>
  render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );

describe('BugForm Integration Tests', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    queryClient.clear();
    localStorage.clear();
  });
  afterAll(() => server.close());

  it('displays login prompt when no token', () => {
    renderWithQueryClient(<BugForm onBugCreated={vi.fn()} />);
    expect(screen.getByText('Please log in to report a bug.')).toBeInTheDocument();
  });

  it('successfully submits bug with valid token', async () => {
    localStorage.setItem('token', 'valid-token');
    const mockBug = {
      _id: '1',
      title: 'Test Bug',
      description: 'Test Description',
      priority: 'high',
    };
    server.use(
      rest.post('/api/bugs', (req, res, ctx) => {
        if (req.headers.get('Authorization') === 'Bearer valid-token') {
          return res(ctx.status(201), ctx.json(mockBug));
        }
        return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }));
      })
    );

    const mockOnBugCreated = vi.fn();
    renderWithQueryClient(<BugForm onBugCreated={mockOnBugCreated} />);

    fireEvent.change(screen.getByLabelText('Bug Title'), {
      target: { value: 'Test Bug' },
    });
    fireEvent.change(screen.getByLabelText('Bug Description'), {
      target: { value: 'Test Description' },
    });
    fireEvent.change(screen.getByLabelText('Priority'), {
      target: { value: 'high' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Report Bug/i }));

    await waitFor(() => {
      expect(mockOnBugCreated).toHaveBeenCalledWith(mockBug);
    });
    expect(screen.queryByText(/Failed to create bug/)).not.toBeInTheDocument();
  });

  it('displays error on failed API call', async () => {
    localStorage.setItem('token', 'invalid-token');
    server.use(
      rest.post('/api/bugs', (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ message: 'Not authorized, token failed' }));
      })
    );

    renderWithQueryClient(<BugForm onBugCreated={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Bug Title'), {
      target: { value: 'Test Bug' },
    });
    fireEvent.change(screen.getByLabelText('Bug Description'), {
      target: { value: 'Test Description' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Report Bug/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error: Not authorized, token failed/)).toBeInTheDocument();
    });
  });
});