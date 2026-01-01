import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Global baseline styles

// Create the root element for React rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Initial render of the App component
// StrictMode helps identify potential problems in the application during development
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);