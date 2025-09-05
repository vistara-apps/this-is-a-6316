import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrivyProvider } from '@privy-io/react-auth'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {privyAppId ? (
      <PrivyProvider
        appId={privyAppId}
        config={{
          appearance: {
            theme: 'light',
            accentColor: 'hsl(240 100% 50%)',
            logo: 'https://your-domain.com/logo.png'
          },
          loginMethods: ['email', 'google', 'twitter'],
          embeddedWallets: {
            createOnLogin: 'users-without-wallets'
          }
        }}
      >
        <App />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(0 0% 100%)',
              color: 'hsl(220 15% 15%)',
              border: '1px solid hsl(220 15% 85%)',
              borderRadius: '10px',
              boxShadow: '0 8px 24px hsla(0, 0%, 0%, 0.12)'
            }
          }}
        />
      </PrivyProvider>
    ) : (
      <>
        <App />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(0 0% 100%)',
              color: 'hsl(220 15% 15%)',
              border: '1px solid hsl(220 15% 85%)',
              borderRadius: '10px',
              boxShadow: '0 8px 24px hsla(0, 0%, 0%, 0.12)'
            }
          }}
        />
      </>
    )}
  </React.StrictMode>,
)
