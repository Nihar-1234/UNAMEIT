"use client";

type NamingCategoryCardProps = {
  icon: string;
  name: string;
  description: string;
  available?: boolean;
  selected: boolean;
  onSelect: () => void;
};

export function NamingCategoryCard({
  icon,
  name,
  description,
  available = false,
  selected,
  onSelect,
}: NamingCategoryCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`category-card ${selected ? "category-card-selected" : ""}`}
      onClick={onSelect}
    >
      <span className="category-icon" aria-hidden="true">{icon}</span>
      <span className="category-copy">
        <span className="category-heading">
          <span>{name}</span>
          {available ? <span className="available-pill">Available</span> : <span className="soon-pill">Coming soon</span>}
        </span>
        <span className="category-description">{description}</span>
      </span>
      <span className="category-check" aria-hidden="true">{selected ? "✓" : ""}</span>
    </button>
  );
}
