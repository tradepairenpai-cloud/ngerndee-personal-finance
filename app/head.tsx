export default function Head() {
  return (
    <>
      <meta name="theme-color" content="#123f36" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <link rel="manifest" href="app.webmanifest" />
      <link rel="apple-touch-icon" href="favicon.svg" />
      <script src="register-sw.js" defer />
    </>
  );
}
