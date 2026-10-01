import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'flag-icons/css/flag-icons.min.css';
import App from './App';

// Suppress cross-origin third party Script error
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    if (e.message === 'Script error.' || e.filename?.includes('payway.com.kh')) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return true;
    }
  }, true);
  window.addEventListener('unhandledrejection', (e) => {
    if (e.reason?.message === 'Script error.' || e.reason?.stack?.includes('payway.com.kh')) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }, true);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
