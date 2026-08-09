import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(15, 20, 40, 0.95)',
            color: '#e2e8f0',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#0a0e1f' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#0a0e1f' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
