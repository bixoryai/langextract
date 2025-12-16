import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Prevent Chrome extension conflicts - immediate execution */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Simple fix for Chrome extension chainId error
              (function() {
                const originalDefineProperty = Object.defineProperty;
                Object.defineProperty = function(obj, prop, descriptor) {
                  try {
                    return originalDefineProperty.call(this, obj, prop, descriptor);
                  } catch (e) {
                    if (e && e.message && e.message.includes('chainId')) {
                      return obj; // Silently ignore
                    }
                    throw e;
                  }
                };
              })();
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