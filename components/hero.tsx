"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NamingCategoryCard } from "./naming-category-card";

type CategoryId = "baby" | "pet" | "business" | "product" | "character" | "other";

type Category = {
  id: CategoryId;
  icon: string;
  name: string;
  description: string;
  available?: boolean;
};

const categories: Category[] = [
  { id: "baby", icon: "✦", name: "Baby", description: "A meaningful name, personalized to your family.", available: true },
  { id: "pet", icon: "♡", name: "Pet", description: "A name as special as your new companion." },
  { id: "business", icon: "◒", name: "Business", description: "A memorable name for your next big idea." },
  { id: "product", icon: "▣", name: "Product", description: "A name that makes your product stand out." },
  { id: "character", icon: "✎", name: "Character", description: "The perfect name for a story in the making." },
  { id: "other", icon: "✳", name: "Something else", description: "Name anything you can imagine." },
];

export function Hero() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const isBabySelected = selectedCategory === "baby";

  function handleContinue() {
    if (isBabySelected) router.push("/baby");
  }

  return (
    <main className="hero" id="how-it-works">
      <div className="hero-kicker"><span className="kicker-line" /> A more thoughtful way to name <span className="kicker-line" /></div>
      <h1>What do you want<br className="desktop-break" /> to name?</h1>
      <p className="hero-intro">Tell us what you&apos;re naming, and we&apos;ll help you find<br className="desktop-break" /> a name that fits.</p>

      <section className="selector" aria-labelledby="selector-title">
        <div className="selector-header">
          <div>
            <p className="eyebrow">Start with a category</p>
            <h2 id="selector-title">Choose your naming adventure</h2>
          </div>
          <span className="step-indicator">Step 1 <span>/ 3</span></span>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <NamingCategoryCard
              key={category.id}
              {...category}
              selected={selectedCategory === category.id}
              onSelect={() => setSelectedCategory(category.id)}
            />
          ))}
        </div>
        <div className="continue-row">
          <button
            type="button"
            className={`continue-button ${isBabySelected ? "continue-button-active" : ""}`}
            disabled={!isBabySelected}
            onClick={handleContinue}
          >
            {isBabySelected ? "Let\'s get started" : "Select an available category"}
            <span aria-hidden="true">→</span>
          </button>
          <p className="selector-note">Personalized naming, powered by a little bit of magic.</p>
        </div>
      </section>
    </main>
  );
}
