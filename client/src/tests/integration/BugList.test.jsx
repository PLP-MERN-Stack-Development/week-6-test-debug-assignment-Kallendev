import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import BugList from '../../components/BugList.jsx';

const server = setupServer();

const queryClient = new QueryClient();

const renderWithQueryClient = (component) =>
  render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );

describe('BugList Integration Tests', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    queryClient.clear();
    localStorage.clear();
  });
  afterAll(() => server.close());

  it('displays login prompt when no token', () => {
    renderWithQueryClient(<BugList />);
    expect(screen.getByText('Please log in to view bugs.')).toBeInTheDocument();
  });

  it('fetches and displays bugs with valid token', async () => {
    localStorage.setItem('token', 'valid-token');
    const mockBugs = [
      {
        _id: '1',
        title: 'Bug 1',
        description: 'Description 1',
        status: 'open',
        priority: 'high',
      },
    ];
    server.use(
      rest.get('/api/bugs', (req, res, ctx) => {
        if (req.headers.get('Authorization') === 'Bearer valid-token') {
          return res(ctx.json(mockBugs));
        }
        return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }));
      })
    );

    renderWithQueryClient(<BugList />);

    await waitFor(() => {
      expect(screen.getByText('Bug 1')).toBeInTheDocument();
      expect(screen.getByText('Status: open')).toBeInTheDocument();
    });
  });

  it('displays error on failed API call', async () => {
    localStorage.setItem('token', 'invalid-token');
    server.use(
      rest.get('/api/bugs', (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ message: 'Not authorized, token failed' }));
      })
    );

    renderWithQueryClient(<BugList />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Not authorized, token failed/)).toBeInTheDocument();
    });
  });
});