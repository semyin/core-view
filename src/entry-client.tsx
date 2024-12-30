import './index.css'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App'

const initialProps = window.__INITIAL_DATA__ || {};

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
      <BrowserRouter>
          <App initialProps={initialProps} />
      </BrowserRouter>
  </StrictMode>,
)
