import type { ReactNode } from "react";

type QuizQuestionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function QuizQuestion({ title, description, children }: QuizQuestionProps) {
  return (
    <div className="quiz-question-wrap">
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="quiz-options-grid">{children}</div>
    </div>
  );
}
