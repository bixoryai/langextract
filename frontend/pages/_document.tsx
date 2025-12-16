import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Prevent Chrome extension conflicts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent extension injection conflicts
              if (typeof window !== 'undefined') {
                // Override problematic extension methods
                const originalDefineProperty = Object.defineProperty;
                Object.defineProperty = function(obj, prop, descriptor) {
                  try {
                    return originalDefineProperty.call(this, obj, prop, descriptor);
                  } catch (e) {
                    // Silently ignore extension-related errors
                    if (e.message && (e.message.includes('chainId') || e.message.includes('extension'))) {
                      return obj;
                    }
                    throw e;
                  }
                };
              }
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}