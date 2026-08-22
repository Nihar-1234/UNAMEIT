type QuizProgressProps = {
  currentStep: number;
  totalSteps: number;
  title: string;
};

export function QuizProgress({ currentStep, totalSteps, title }: QuizProgressProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="quiz-progress-wrap">
      <div className="quiz-progress-header">
        <span className="quiz-progress-title">{title}</span>
        <span className="quiz-progress-meta">Question {currentStep} of {totalSteps}</span>
      </div>
      <div className="quiz-progress-bar" aria-hidden="true">
        <div className="quiz-progress-fill" style={{ width: `${progressPercentage}%` }} />
      </div>
    </div>
  );
}
