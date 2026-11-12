import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import Landing from './landing/Landing';

/** Renders the page to static HTML at build time (see scripts/prerender.mjs). */
export function render() {
  return renderToString(
    <StrictMode>
      <Landing />
    </StrictMode>,
  );
}
