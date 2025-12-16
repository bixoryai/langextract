import React from 'react';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Ignore extension-related errors
    if (error.message.includes('chainId') ||
        error.message.includes('extension') ||
        error.message.includes('inpage.js')) {
      return { hasError: false };
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Ignore extension-related errors
    if (error.message.includes('chainId') ||
        error.message.includes('extension') ||
        error.message.includes('inpage.js')) {
      console.warn('Ignored extension-related error:', error.message);
      return;
    }

    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600">Please refresh the page to try again.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;