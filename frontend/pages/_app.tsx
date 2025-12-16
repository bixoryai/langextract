import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Handle Chrome extension conflicts
    const handleError = (event: ErrorEvent) => {
      // Ignore common extension-related errors
      if (event.message.includes('chainId') ||
          event.message.includes('extension') ||
          event.message.includes('inpage.js')) {
        event.preventDefault();
        console.warn('Ignored extension error:', event.message);
        return false;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Ignore extension-related promise rejections
      if (event.reason && typeof event.reason === 'string' &&
          (event.reason.includes('chainId') ||
           event.reason.includes('extension') ||
           event.reason.includes('inpage.js'))) {
        event.preventDefault();
        console.warn('Ignored extension promise rejection:', event.reason);
        return false;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp;