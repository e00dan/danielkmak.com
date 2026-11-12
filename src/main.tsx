import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import Landing from './landing/Landing';
import './landing/landing.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <Landing />
  </StrictMode>
);

// Production HTML is pre-rendered at build time; the dev server serves an empty root.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
