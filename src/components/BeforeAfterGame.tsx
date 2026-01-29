import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HIJRI_MONTHS, shuffleArray, getTodayHijri } from "@/lib/hijriData";
import { RotateCcw, Check, X, ArrowLeftRight } from "lucide-react";

type QuestionType = "before" | "after";

interface Question {
  type: QuestionType;
  targetMonth: typeof HIJRI_MONTHS[number];
  correctAnswer: typeof HIJRI_MONTHS[number];
  options: typeof HIJRI_MONTHS[number][];
}

function generateQuestion(): Question {
  const todayHijri = getTodayHijri();
  
  // Bias toward current month sometimes
  const useTodayMonth = Math.random() < 0.3;
  let targetIndex: number;
  
  if (useTodayMonth) {
    targetIndex = todayHijri.month - 1;
  } else {
    targetIndex = Math.floor(Math.random() * 12);
  }
  
  const type: QuestionType = Math.random() < 0.5 ? "before" : "after";
  
  // Calculate correct answer index with wrap-around
  let correctIndex: number;
  if (type === "before") {
    correctIndex = targetIndex === 0 ? 11 : targetIndex - 1;
  } else {
    correctIndex = targetIndex === 11 ? 0 : targetIndex + 1;
  }
  
  const targetMonth = HIJRI_MONTHS[targetIndex];
  const correctAnswer = HIJRI_MONTHS[correctIndex];
  
  // Generate wrong options (3 other months, not correct answer or target)
  const wrongOptions = HIJRI_MONTHS.filter(
    (m) => m.id !== correctAnswer.id && m.id !== targetMonth.id
  );
  const shuffledWrong = shuffleArray([...wrongOptions]).slice(0, 3);
  
  // Combine and shuffle all options
  const options = shuffleArray([correctAnswer, ...shuffledWrong]);
  
  return {
    type,
    targetMonth,
    correctAnswer,
    options,
  };
}

export function BeforeAfterGame() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    nextQuestion();
  }, []);

  const nextQuestion = () => {
    setQuestion(generateQuestion());
    setSelectedAnswer(null);
    setFeedback(null);
    setIsAnswered(false);
  };

  const handleAnswer = (optionId: number) => {
    if (isAnswered || !question) return;

    setSelectedAnswer(optionId);
    setIsAnswered(true);
    setTotalQuestions(totalQuestions + 1);

    const isCorrect = optionId === question.correctAnswer.id;

    if (isCorrect) {
      setScore(score + 1);
      setFeedback({ correct: true, message: "Benar! 🎉" });
    } else {
      setFeedback({
        correct: false,
        message: `Salah! Jawaban yang benar: ${question.correctAnswer.name}`,
      });
    }

    // Auto next after delay
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const resetGame = () => {
    setScore(0);
    setTotalQuestions(0);
    nextQuestion();
  };

  if (!question) return null;

  const questionText =
    question.type === "before"
      ? `Sebelum ${question.targetMonth.name} adalah …`
      : `Setelah ${question.targetMonth.name} adalah …`;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            Sebelum & Sesudah
          </span>
          <span className="text-sm bg-primary-foreground/20 px-3 py-1 rounded-full">
            Skor: {score}/{totalQuestions}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Instruksi */}
        <p className="text-sm text-muted-foreground text-center mb-4">
          Pilih bulan yang tepat sebelum atau sesudah bulan yang ditanyakan
        </p>

        {/* Pertanyaan */}
        <div className="bg-muted p-4 rounded-lg text-center mb-4">
          <p className="text-lg font-semibold">{questionText}</p>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              feedback.correct
                ? "bg-success/20 text-success"
                : "bg-destructive/20 text-destructive"
            }`}
          >
            {feedback.correct ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            <span className="font-medium">{feedback.message}</span>
          </div>
        )}

        {/* Pilihan Jawaban */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrect = option.id === question.correctAnswer.id;
            const showResult = isAnswered;

            let buttonClass = "h-auto py-3 text-left justify-start";
            if (showResult && isCorrect) {
              buttonClass += " bg-success text-success-foreground hover:bg-success";
            } else if (showResult && isSelected && !isCorrect) {
              buttonClass += " bg-destructive text-destructive-foreground hover:bg-destructive";
            }

            return (
              <Button
                key={option.id}
                variant={isSelected && !showResult ? "default" : "outline"}
                className={buttonClass}
                onClick={() => handleAnswer(option.id)}
                disabled={isAnswered}
              >
                <span className="font-medium">{option.name}</span>
              </Button>
            );
          })}
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetGame} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Mulai Ulang
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
