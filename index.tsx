import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import FirebaseErrorBoundary from './components/FirebaseErrorBoundary';
import { UserProfileProvider } from './hooks/useUserProfile';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <FirebaseErrorBoundary>
      <UserProfileProvider>
        <App />
      </UserProfileProvider>
    </FirebaseErrorBoundary>
  </React.StrictMode>
);
