import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HIJRI_MONTHS, shuffleArray } from "@/lib/hijriData";
import { HelpCircle, RotateCcw, Check, X, ChevronRight } from "lucide-react";

interface Question {
  sequence: (typeof HIJRI_MONTHS[number] | null)[];
  correctAnswer: typeof HIJRI_MONTHS[number];
  gapIndex: number;
  options: typeof HIJRI_MONTHS[number][];
}

function generateQuestion(): Question {
  // Pick a random starting point for a sequence of 4 months
  const startIndex = Math.floor(Math.random() * 9); // 0-8 to ensure 4 months fit
  const sequence = HIJRI_MONTHS.slice(startIndex, startIndex + 4);
  
  // Pick which one to hide (index 1 or 2 - middle positions)
  const gapIndex = Math.random() < 0.5 ? 1 : 2;
  const correctAnswer = sequence[gapIndex];
  
  // Create sequence with gap
  const sequenceWithGap = sequence.map((month, idx) => 
    idx === gapIndex ? null : month
  );
  
  // Generate wrong options
  const wrongOptions = HIJRI_MONTHS.filter(m => m.id !== correctAnswer.id);
  const shuffledWrong = shuffleArray([...wrongOptions]).slice(0, 3);
  const options = shuffleArray([correctAnswer, ...shuffledWrong]);
  
  return {
    sequence: sequenceWithGap,
    correctAnswer,
    gapIndex,
    options,
  };
}

export function FillGapGame() {
  const [question, setQuestion] = useState<Question>(generateQuestion);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);

  const handleAnswer = (optionId: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(optionId);
    const isCorrect = optionId === question.correctAnswer.id;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback({ correct: true, message: "Benar! 🎉" });
    } else {
      setFeedback({ 
        correct: false, 
        message: `Salah! Jawaban: ${question.correctAnswer.name}` 
      });
    }
    setTotalQuestions(prev => prev + 1);
  };

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion());
    setSelectedAnswer(null);
    setFeedback(null);
  }, []);

  const resetGame = () => {
    setScore(0);
    setTotalQuestions(0);
    nextQuestion();
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Lengkapi yang Hilang
          </span>
          <span className="text-sm bg-primary-foreground/20 px-3 py-1 rounded-full">
            Skor: {score}/{totalQuestions}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Sequence Display */}
        <div className="bg-muted p-4 rounded-lg mb-4">
          <p className="text-sm text-muted-foreground mb-3 text-center">
            Isi bulan yang hilang:
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {question.sequence.map((month, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {month ? (
                  <span className="bg-background px-3 py-2 rounded-lg font-medium text-sm">
                    {month.name}
                  </span>
                ) : (
                  <span className="bg-accent px-4 py-2 rounded-lg font-bold text-accent-foreground border-2 border-dashed border-accent-foreground/50">
                    ???
                  </span>
                )}
                {idx < question.sequence.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`flex items-center justify-center gap-2 p-3 rounded-lg mb-4 ${
            feedback.correct 
              ? "bg-success/20 text-success" 
              : "bg-destructive/20 text-destructive"
          }`}>
            {feedback.correct ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            <span className="font-medium">{feedback.message}</span>
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrect = option.id === question.correctAnswer.id;
            const showResult = selectedAnswer !== null;

            let variant: "outline" | "default" = "outline";
            let extraClass = "";
            
            if (showResult && isCorrect) {
              extraClass = "bg-success text-success-foreground hover:bg-success";
            } else if (showResult && isSelected && !isCorrect) {
              extraClass = "bg-destructive text-destructive-foreground hover:bg-destructive";
            }

            return (
              <Button
                key={option.id}
                variant={variant}
                className={`h-auto py-3 ${extraClass}`}
                onClick={() => handleAnswer(option.id)}
                disabled={selectedAnswer !== null}
              >
                {option.name}
              </Button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {selectedAnswer !== null && (
            <Button onClick={nextQuestion} className="flex-1">
              Soal Berikutnya
            </Button>
          )}
          <Button onClick={resetGame} variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
