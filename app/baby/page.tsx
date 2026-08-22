import Link from "next/link";

export default function BabyPage() {
  return (
    <main className="baby-page">
      <Link className="brand baby-brand" href="/">
        <span className="brand-mark" aria-hidden="true">u</span>
        <span>UnameIt</span>
      </Link>
      <div className="baby-message">
        <span className="message-icon" aria-hidden="true">✦</span>
        <p className="eyebrow">Your naming journey begins here</p>
        <h1>The baby naming quiz<br />is coming next.</h1>
        <p>We&apos;re putting the thoughtful questions in place to help you find a name that feels like yours.</p>
        <Link className="back-link" href="/">← Back to categories</Link>
      </div>
    </main>
  );
}
