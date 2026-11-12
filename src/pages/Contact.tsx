import { FaRegPaperPlane } from 'react-icons/fa';

const EMAIL = 'hi@danielkmak.com';

export default function Contact() {
  return (
    <section className="contact">
      <div className="intro-text">
        <a className="bw-box" href={`mailto:${EMAIL}`} aria-label={`Send an email to ${EMAIL}`}>
          <div className="main">{EMAIL}</div>
          <footer>
            <FaRegPaperPlane aria-hidden="true" />
          </footer>
        </a>
      </div>
    </section>
  );
}
