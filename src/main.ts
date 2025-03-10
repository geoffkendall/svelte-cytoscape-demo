// Add a process shim for browser environment
// This is needed for some libraries that expect Node.js process to be available
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.process = {
    env: {
      NODE_ENV: 'production'
    }
  };
}

import App from './App.svelte';

const app = new App({
  target: document.body
});

export default app;
