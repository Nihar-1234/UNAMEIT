type QuizOptionProps = {
  icon: string;
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
};

export function QuizOption({
  icon,
  label,
  description,
  selected,
  onSelect,
}: QuizOptionProps) {
  return (
    <button
      type="button"
      className={`quiz-option ${selected ? "quiz-option-selected" : ""}`}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className="quiz-option-icon" aria-hidden="true">{icon}</span>
      <span className="quiz-option-copy">
        <span className="quiz-option-label">{label}</span>
        {description ? <span className="quiz-option-description">{description}</span> : null}
      </span>
      <span className="quiz-option-check" aria-hidden="true">{selected ? "✓" : ""}</span>
    </button>
  );
}
