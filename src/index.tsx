import React from 'react';
import ReactDOM from 'react-dom/client';

import { Router } from './Router';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query'

import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <ToastContainer />
    </QueryClientProvider>
  </React.StrictMode>
);
