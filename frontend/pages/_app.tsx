import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Comprehensive Chrome extension conflict prevention
    const handleError = (event: ErrorEvent) => {
      // Suppress ALL extension-related errors
      if (event.message && (
        event.message.includes('chainId') ||
        event.message.includes('extension') ||
        event.message.includes('inpage.js') ||
        event.message.includes('getter') ||
        event.message.includes('has only a getter') ||
        event.message.includes('Cannot set property')
      )) {
        event.preventDefault();
        event.stopImmediatePropagation();
        console.warn('Suppressed extension error:', event.message);
        return false;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Suppress extension-related promise rejections
      const reason = event.reason;
      if (reason && (
        (typeof reason === 'string' && (
          reason.includes('chainId') ||
          reason.includes('extension') ||
          reason.includes('inpage.js') ||
          reason.includes('getter')
        )) ||
        (reason.message && (
          reason.message.includes('chainId') ||
          reason.message.includes('extension') ||
          reason.message.includes('inpage.js') ||
          reason.message.includes('getter') ||
          reason.message.includes('has only a getter')
        ))
      )) {
        event.preventDefault();
        event.stopImmediatePropagation();
        console.warn('Suppressed extension promise rejection:', reason);
        return false;
      }
    };

    // Add listeners with capture to catch errors early
    window.addEventListener('error', handleError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);

    return () => {
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
    };
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;