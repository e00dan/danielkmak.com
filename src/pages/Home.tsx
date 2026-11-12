import Particles from '../components/Particles';

export default function Home() {
  return (
    <section className="hero">
      <div className="hero-content intro-text noselect">
        <Particles className="particles" />
        <div className="bw-box">
          <h1 className="main">Fullstack Engineer</h1>
        </div>
      </div>
    </section>
  );
}
