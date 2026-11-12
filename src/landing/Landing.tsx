import { useEffect, useState, type FormEvent } from 'react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import {
  LuArrowRight,
  LuFileCode,
  LuLayers,
  LuServer,
  LuSquareTerminal,
  LuUsers,
  LuWaypoints,
  LuShieldCheck,
  LuGitBranch,
  LuLink,
} from 'react-icons/lu';
import Skyline from './Skyline';
import {
  BridgeScene,
  FeaturedScene,
  InfraScene,
  ThumbBlocks,
  ThumbBlueprint,
  ThumbChain,
  TokensScene,
  ToolingScene,
} from './Scenes';

const EMAIL = 'hi@danielkmak.com';
const GITHUB = 'https://github.com/e00dan';
const LINKEDIN = 'https://www.linkedin.com/in/kmakdaniel/';

const NAV = [
  { href: '#top', label: 'Home' },
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

const WORK = [
  { title: 'Cross-Chain Bridges', text: 'Token & governance messaging across EVM and Solana', Scene: BridgeScene },
  { title: 'Omnichain Tokens', text: 'Token deployments and migrations across many networks', Scene: TokensScene },
  { title: 'Developer Tooling', text: 'TypeScript tooling and workflow automation for protocol teams', Scene: ToolingScene },
  { title: 'Protocol Infrastructure', text: 'Node operations, cloud environments and L1/L2 ecosystems', Scene: InfraScene },
];

const EXPERTISE = [
  { Icon: LuFileCode, title: 'Smart Contracts', text: 'Solidity · Foundry' },
  { Icon: LuLayers, title: 'Solana', text: 'Rust · Anchor' },
  { Icon: LuWaypoints, title: 'Cross-Chain', text: 'Bridges & messaging' },
  { Icon: LuSquareTerminal, title: 'Developer Tooling', text: 'TypeScript · Node.js' },
  { Icon: LuServer, title: 'Infrastructure', text: 'Kubernetes · AWS' },
  { Icon: LuUsers, title: 'Leadership', text: 'Teams & hiring' },
];

function ContactForm() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const subject = name ? `Hello from ${name}` : 'Hello from danielkmak.com';
    const body = [message, '', name && `— ${name}`].filter(Boolean).join('\n');
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <label>
        <span className="sr-only">Your name</span>
        <input name="name" placeholder="Your name" autoComplete="name" />
      </label>
      <label>
        <span className="sr-only">Message</span>
        <textarea name="message" placeholder="Message" rows={3} required />
      </label>
      <button type="submit" className="btn btn-gold">
        Send Message <LuArrowRight aria-hidden="true" />
      </button>
      <p className="form-note" aria-live="polite">
        {sent ? 'Your email app should open with the message ready to send.' : 'Opens your email app — nothing is stored here.'}
      </p>
    </form>
  );
}

export default function Landing() {
  // Old Ember/React URLs used hash routes (#/contact); map them onto sections.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith('#/')) return;
    const target = hash.slice(2) === 'contact' ? 'contact' : 'top';
    history.replaceState(null, '', `#${target}`);
    document.getElementById(target)?.scrollIntoView();
  }, []);

  return (
    <div className="page" id="top">
      <header className="nav glass">
        <a href="#top" className="brand">
          <span className="brand-mark" aria-hidden="true">
            DK
          </span>
          <span className="brand-name">Daniel Kmak</span>
        </a>
        <nav aria-label="Sections">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="btn btn-gold btn-sm">
          Let&rsquo;s Build <LuArrowRight aria-hidden="true" />
        </a>
      </header>

      <section className="hero">
        <Skyline className="hero-art" />
        <div className="hero-copy">
          <p className="eyebrow">
            Blockchain Engineer <span>/</span> Builder
          </p>
          <h1>Building Bridges Between Chains</h1>
          <p className="lede">
            I design and build blockchain infrastructure — cross-chain bridges, token standards and developer tooling
            across EVM and Solana. Shipping in web3 since 2017.
          </p>
          <div className="actions">
            <a href="#work" className="btn btn-gold">
              View Work <LuArrowRight aria-hidden="true" />
            </a>
            <a href="#about" className="btn btn-glass">
              About Me
            </a>
          </div>
        </div>
      </section>

      <main>
        <section id="work" className="section">
          <div className="section-head">
            <h2 className="eyebrow eyebrow-line">Selected Work</h2>
            <a href={GITHUB} className="btn btn-glass btn-sm" target="_blank" rel="noreferrer">
              GitHub <LuArrowRight aria-hidden="true" />
            </a>
          </div>
          <div className="cards">
            {WORK.map(({ title, text, Scene }) => (
              <article key={title} className="card glass">
                <div className="card-art">
                  <Scene />
                </div>
                <div className="card-body">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section featured glass" aria-labelledby="featured-title">
          <div className="featured-art">
            <FeaturedScene />
          </div>
          <div className="featured-copy">
            <p className="eyebrow eyebrow-line">Featured Work</p>
            <h2 id="featured-title">Cross-Chain Bridge — Tokens &amp; Governance</h2>
            <p>
              Designed and built bridging infrastructure for one of DeFi&rsquo;s longest-standing protocols: tokens move
              between chains, and decisions voted on one chain are executed securely on others. Built on EVM and Solana.
            </p>
            <div className="thumbs">
              <ThumbBlocks />
              <ThumbBlueprint />
              <ThumbChain />
            </div>
            <ul className="tags">
              <li>
                <LuShieldCheck aria-hidden="true" /> Smart Contracts
              </li>
              <li>
                <LuLink aria-hidden="true" /> Cross-Chain Messaging
              </li>
              <li>
                <LuGitBranch aria-hidden="true" /> Governance
              </li>
            </ul>
          </div>
        </section>

        <section id="about" className="section about">
          <div className="about-copy">
            <h2 className="eyebrow eyebrow-line">About</h2>
            <p>
              Engineer since 2016, in blockchain since 2017 and fully remote since 2018. Most recently I led an
              integrations team at a cross-chain protocol — owning technical quality, hiring engineers and shipping the
              most critical partner integrations myself.
            </p>
          </div>
          <ul className="expertise glass">
            {EXPERTISE.map(({ Icon, title, text }) => (
              <li key={title}>
                <Icon aria-hidden="true" />
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className="section contact glass">
          <div className="contact-art">
            <Skyline variant="sketch" />
          </div>
          <div className="contact-copy">
            <h2 className="eyebrow eyebrow-line">Get in Touch</h2>
            <p>
              Have a project or role in mind?
              <br />
              Let&rsquo;s build something remarkable together.
            </p>
            <a className="contact-email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </div>
          <ContactForm />
        </section>
      </main>

      <footer className="footer">
        <a href="#top" className="brand">
          <span className="brand-mark" aria-hidden="true">
            DK
          </span>
          <span className="brand-name">Daniel Kmak</span>
        </a>
        <p className="footer-meta">
          Warsaw, PL <span className="dot" aria-hidden="true" /> Working remotely
        </p>
        <div className="socials">
          <a href={GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub">
            <FaGithub />
          </a>
          <a href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
        </div>
      </footer>
    </div>
  );
}
