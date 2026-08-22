import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UnameIt | Find a name worth remembering",
  description: "A thoughtful, personalized way to find the right name.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
