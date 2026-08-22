import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer" id="about">
      <div>
        <Link className="footer-brand" href="/">UnameIt</Link>
        <p>Find a name worth remembering.</p>
      </div>
      <div className="footer-right">
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#about">About</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </nav>
        <p className="copyright">© 2026 UnameIt, made for the names that matter.</p>
      </div>
    </footer>
  );
}
