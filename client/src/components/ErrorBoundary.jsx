import React from 'react';
import { AlertCircle } from 'lucide-react';
import { logger } from '../utils/logger';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Uncaught error in component', {
      error: error.message,
      stack: errorInfo.componentStack,
    });
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary p-6 bg-red-100 rounded-lg max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-red-800 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Something went wrong
          </h2>
          <p className="text-red-600">{this.state.error?.message || 'Unknown error'}</p>
          {import.meta.env.MODE === 'development' && this.state.errorInfo && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-600">Stack trace</summary>
              <pre className="text-xs text-gray-500">{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;