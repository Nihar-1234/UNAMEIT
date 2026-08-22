import Link from "next/link";

export function Navbar() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="UnameIt home">
        <span className="brand-mark" aria-hidden="true">u</span>
        <span>UnameIt</span>
      </Link>
      <nav className="nav-links" aria-label="Main navigation">
        <a href="#about">About</a>
        <a href="#how-it-works">How it works</a>
        <button type="button" className="sign-in-button">Sign in</button>
      </nav>
    </header>
  );
}
