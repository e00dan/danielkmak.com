import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, Navigate, RouterProvider } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import './styles.css';

// Hash routing keeps the old Ember URLs (e.g. danielkmak.com/#/contact) working
// and needs no 404.html fallback on GitHub Pages.
const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
