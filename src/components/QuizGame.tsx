import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HIJRI_MONTHS, getTodayHijri, shuffleArray } from "@/lib/hijriData";
import { HelpCircle, Check, X, RotateCcw, Trophy } from "lucide-react";

type QuestionType = "position" | "before" | "after";

interface Question {
  type: QuestionType;
  targetMonth: typeof HIJRI_MONTHS[number];
  questionText: string;
  correctAnswer: string;
  options: string[];
}

export function QuizGame() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const generateQuestion = useCallback((): Question => {
    const hijriToday = getTodayHijri();
    const questionTypes: QuestionType[] = ["position", "before", "after"];
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    // 50% kemungkinan menggunakan bulan saat ini
    const useTodayMonth = Math.random() < 0.5;
    const randomIndex = Math.floor(Math.random() * 12);
    
    let targetMonth;
    if (useTodayMonth) {
      targetMonth = HIJRI_MONTHS[hijriToday.month - 1];
    } else {
      targetMonth = HIJRI_MONTHS[randomIndex];
    }

    let questionText: string;
    let correctAnswer: string;
    let options: string[];

    switch (type) {
      case "position":
        questionText = `Bulan ${targetMonth.name} adalah bulan ke-berapa dalam kalender Hijriyah?`;
        correctAnswer = targetMonth.id.toString();
        options = shuffleArray(["1", "3", "6", "9", "12", targetMonth.id.toString()])
          .filter((v, i, a) => a.indexOf(v) === i)
          .slice(0, 4);
        if (!options.includes(correctAnswer)) {
          options[0] = correctAnswer;
          options = shuffleArray(options);
        }
        break;

      case "before":
        if (targetMonth.id === 1) {
          // Muharram tidak punya bulan sebelumnya, ganti pertanyaan
          questionText = `Bulan ${targetMonth.name} adalah bulan pertama. Bulan apa yang terakhir dalam kalender Hijriyah?`;
          correctAnswer = HIJRI_MONTHS[11].name;
        } else {
          questionText = `Bulan apa yang berada SEBELUM bulan ${targetMonth.name}?`;
          correctAnswer = HIJRI_MONTHS[targetMonth.id - 2].name;
        }
        options = shuffleArray(HIJRI_MONTHS.map(m => m.name))
          .filter(name => name !== targetMonth.name)
          .slice(0, 3);
        options.push(correctAnswer);
        options = shuffleArray([...new Set(options)]).slice(0, 4);
        break;

      case "after":
        if (targetMonth.id === 12) {
          // Dzulhijjah tidak punya bulan setelahnya, ganti pertanyaan
          questionText = `Bulan ${targetMonth.name} adalah bulan terakhir. Bulan apa yang pertama dalam kalender Hijriyah?`;
          correctAnswer = HIJRI_MONTHS[0].name;
        } else {
          questionText = `Bulan apa yang berada SESUDAH bulan ${targetMonth.name}?`;
          correctAnswer = HIJRI_MONTHS[targetMonth.id].name;
        }
        options = shuffleArray(HIJRI_MONTHS.map(m => m.name))
          .filter(name => name !== targetMonth.name)
          .slice(0, 3);
        options.push(correctAnswer);
        options = shuffleArray([...new Set(options)]).slice(0, 4);
        break;
    }

    return { type, targetMonth, questionText, correctAnswer, options };
  }, []);

  useEffect(() => {
    setQuestion(generateQuestion());
  }, [generateQuestion]);

  const handleAnswer = (answer: string) => {
    if (isAnswered || !question) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setTotalQuestions(totalQuestions + 1);
    
    const isCorrect = answer === question.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback({ correct: true, message: "Benar! Jawaban kamu tepat! 🎉" });
    } else {
      setFeedback({ 
        correct: false, 
        message: `Salah! Jawaban yang benar: ${question.correctAnswer}` 
      });
    }
  };

  const nextQuestion = () => {
    setQuestion(generateQuestion());
    setSelectedAnswer(null);
    setFeedback(null);
    setIsAnswered(false);
  };

  const resetGame = () => {
    setScore(0);
    setTotalQuestions(0);
    nextQuestion();
  };

  if (!question) return null;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Kuis Bulan Hijriyah
          </span>
          <span className="text-sm bg-primary-foreground/20 px-3 py-1 rounded-full">
            Skor: {score}/{totalQuestions}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Pertanyaan */}
        <div className="text-center mb-6">
          <p className="text-lg font-medium text-foreground">{question.questionText}</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {question.options.map((option, index) => {
            let buttonStyle = "border-2 border-border hover:border-primary hover:bg-primary/5";
            
            if (isAnswered) {
              if (option === question.correctAnswer) {
                buttonStyle = "border-2 border-success bg-success/20 text-success";
              } else if (option === selectedAnswer) {
                buttonStyle = "border-2 border-destructive bg-destructive/20 text-destructive";
              } else {
                buttonStyle = "border-2 border-border opacity-50";
              }
            } else if (selectedAnswer === option) {
              buttonStyle = "border-2 border-primary bg-primary/10";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={`p-4 rounded-lg font-medium transition-all ${buttonStyle}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-2">
          {isAnswered ? (
            <Button onClick={nextQuestion} className="flex-1">
              Soal Berikutnya
            </Button>
          ) : (
            <div className="flex-1 text-center text-muted-foreground text-sm">
              Pilih salah satu jawaban di atas
            </div>
          )}
          <Button variant="outline" onClick={resetGame}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Statistik */}
        {totalQuestions > 0 && (
          <div className="mt-4 pt-4 border-t border-border text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>
                Akurasi: {Math.round((score / totalQuestions) * 100)}% ({score} dari {totalQuestions} soal)
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
