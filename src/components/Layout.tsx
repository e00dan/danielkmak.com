import type { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router';
import { FaGithub, FaHome, FaLinkedin, FaRegEnvelope } from 'react-icons/fa';

function NavItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <>
      {icon}
      <span>{label}</span>
    </>
  );
}

export default function Layout() {
  return (
    <>
      <nav className="icon-bar noselect">
        <NavLink to="/" end className="item">
          <NavItem icon={<FaHome />} label="Home" />
        </NavLink>
        <a href="https://github.com/e00dan" className="item" target="_blank" rel="noreferrer">
          <NavItem icon={<FaGithub />} label="GitHub" />
        </a>
        <a href="https://www.linkedin.com/in/kmakdaniel/" className="item" target="_blank" rel="noreferrer">
          <NavItem icon={<FaLinkedin />} label="LinkedIn" />
        </a>
        <NavLink to="/contact" className="item">
          <NavItem icon={<FaRegEnvelope />} label="Contact" />
        </NavLink>
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  );
}
