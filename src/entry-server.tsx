import { StrictMode } from 'react'
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server'

import App from './App'

export function render(_url: string) {
  const html = renderToString(
    <StrictMode>
        <StaticRouter location={_url}>
            <App />
        </StaticRouter>
    </StrictMode>,
  )
  return { html }
}
