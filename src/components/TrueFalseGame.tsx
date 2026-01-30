import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HIJRI_MONTHS, shuffleArray } from "@/lib/hijriData";
import { CheckCircle, XCircle, RotateCcw, Check, X } from "lucide-react";

type StatementType = "position" | "before" | "after";

interface Question {
  statement: string;
  isTrue: boolean;
}

function generateQuestion(): Question {
  const types: StatementType[] = ["position", "before", "after"];
  const type = types[Math.floor(Math.random() * types.length)];
  const shouldBeTrue = Math.random() < 0.5;
  
  const targetIndex = Math.floor(Math.random() * 12);
  const targetMonth = HIJRI_MONTHS[targetIndex];
  
  let statement: string;
  let isTrue: boolean;

  if (type === "position") {
    if (shouldBeTrue) {
      statement = `${targetMonth.name} adalah bulan ke-${targetIndex + 1} Hijriyah`;
      isTrue = true;
    } else {
      // Pick a wrong position
      let wrongPos = Math.floor(Math.random() * 12) + 1;
      while (wrongPos === targetIndex + 1) {
        wrongPos = Math.floor(Math.random() * 12) + 1;
      }
      statement = `${targetMonth.name} adalah bulan ke-${wrongPos} Hijriyah`;
      isTrue = false;
    }
  } else if (type === "before") {
    const beforeIndex = targetIndex === 0 ? 11 : targetIndex - 1;
    const correctBefore = HIJRI_MONTHS[beforeIndex];
    
    if (shouldBeTrue) {
      statement = `Sebelum ${targetMonth.name} adalah ${correctBefore.name}`;
      isTrue = true;
    } else {
      const wrongMonths = HIJRI_MONTHS.filter(m => m.id !== correctBefore.id && m.id !== targetMonth.id);
      const wrongMonth = shuffleArray([...wrongMonths])[0];
      statement = `Sebelum ${targetMonth.name} adalah ${wrongMonth.name}`;
      isTrue = false;
    }
  } else {
    const afterIndex = targetIndex === 11 ? 0 : targetIndex + 1;
    const correctAfter = HIJRI_MONTHS[afterIndex];
    
    if (shouldBeTrue) {
      statement = `Setelah ${targetMonth.name} adalah ${correctAfter.name}`;
      isTrue = true;
    } else {
      const wrongMonths = HIJRI_MONTHS.filter(m => m.id !== correctAfter.id && m.id !== targetMonth.id);
      const wrongMonth = shuffleArray([...wrongMonths])[0];
      statement = `Setelah ${targetMonth.name} adalah ${wrongMonth.name}`;
      isTrue = false;
    }
  }

  return { statement, isTrue };
}

export function TrueFalseGame() {
  const [question, setQuestion] = useState<Question>(generateQuestion);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean } | null>(null);

  const handleAnswer = (userAnswer: boolean) => {
    if (answer !== null) return;
    
    setAnswer(userAnswer);
    const isCorrect = userAnswer === question.isTrue;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setFeedback({ correct: isCorrect });
    setTotalQuestions(prev => prev + 1);
  };

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion());
    setAnswer(null);
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
            <CheckCircle className="h-5 w-5" />
            Benar / Salah
          </span>
          <span className="text-sm bg-primary-foreground/20 px-3 py-1 rounded-full">
            Skor: {score}/{totalQuestions}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Statement */}
        <div className="bg-muted p-6 rounded-lg mb-4 text-center">
          <p className="text-lg font-semibold">{question.statement}</p>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`flex items-center justify-center gap-2 p-3 rounded-lg mb-4 ${
            feedback.correct 
              ? "bg-success/20 text-success" 
              : "bg-destructive/20 text-destructive"
          }`}>
            {feedback.correct ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            <span className="font-medium">
              {feedback.correct ? "Benar! 🎉" : `Salah! Jawaban: ${question.isTrue ? "Benar" : "Salah"}`}
            </span>
          </div>
        )}

        {/* Answer Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            size="lg"
            variant={answer === true ? (question.isTrue ? "default" : "destructive") : "outline"}
            className={`h-16 text-lg ${
              answer !== null && question.isTrue 
                ? "bg-success text-success-foreground hover:bg-success" 
                : ""
            }`}
            onClick={() => handleAnswer(true)}
            disabled={answer !== null}
          >
            <CheckCircle className="h-6 w-6 mr-2" />
            Benar
          </Button>
          <Button
            size="lg"
            variant={answer === false ? (!question.isTrue ? "default" : "destructive") : "outline"}
            className={`h-16 text-lg ${
              answer !== null && !question.isTrue 
                ? "bg-success text-success-foreground hover:bg-success" 
                : ""
            }`}
            onClick={() => handleAnswer(false)}
            disabled={answer !== null}
          >
            <XCircle className="h-6 w-6 mr-2" />
            Salah
          </Button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {answer !== null && (
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
