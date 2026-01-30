import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HIJRI_MONTHS, shuffleArray, getTodayHijri } from "@/lib/hijriData";
import { Timer, Play, RotateCcw, Check, X, Zap, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type QuestionType = "order" | "before" | "after";

interface Question {
  type: QuestionType;
  questionText: string;
  correctAnswer: typeof HIJRI_MONTHS[number];
  options: typeof HIJRI_MONTHS[number][];
}

function generateQuestion(): Question {
  const todayHijri = getTodayHijri();
  const questionTypes: QuestionType[] = ["order", "before", "after"];
  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  
  // Bias toward current month sometimes
  const useTodayMonth = Math.random() < 0.25;
  let targetIndex: number;
  
  if (useTodayMonth && type !== "order") {
    targetIndex = todayHijri.month - 1;
  } else {
    targetIndex = Math.floor(Math.random() * 12);
  }

  let correctIndex: number;
  let questionText: string;

  if (type === "order") {
    correctIndex = targetIndex;
    questionText = `Bulan ke-${targetIndex + 1} dalam kalender Hijriyah adalah …`;
  } else if (type === "before") {
    correctIndex = targetIndex === 0 ? 11 : targetIndex - 1;
    questionText = `Sebelum ${HIJRI_MONTHS[targetIndex].name} adalah …`;
  } else {
    correctIndex = targetIndex === 11 ? 0 : targetIndex + 1;
    questionText = `Setelah ${HIJRI_MONTHS[targetIndex].name} adalah …`;
  }

  const correctAnswer = HIJRI_MONTHS[correctIndex];

  // Generate wrong options
  const wrongOptions = HIJRI_MONTHS.filter(
    (m) => m.id !== correctAnswer.id
  );
  const shuffledWrong = shuffleArray([...wrongOptions]).slice(0, 3);
  const options = shuffleArray([correctAnswer, ...shuffledWrong]);

  return {
    type,
    questionText,
    correctAnswer,
    options,
  };
}

const INITIAL_TIME = 30;
const HIGHSCORE_KEY = "hijri-timechallenge-highscore";

function getStoredHighscore(): number {
  try {
    const stored = localStorage.getItem(HIGHSCORE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

function setStoredHighscore(score: number): void {
  try {
    localStorage.setItem(HIGHSCORE_KEY, score.toString());
  } catch {
    // Ignore storage errors
  }
}

export function TimeChallengeGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(getStoredHighscore);
  const [isNewHighscore, setIsNewHighscore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean } | null>(null);

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion());
    setSelectedAnswer(null);
    setFeedback(null);
  }, []);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setIsNewHighscore(false);
    setTimeLeft(INITIAL_TIME);
    nextQuestion();
  };

  const endGame = useCallback(() => {
    setGameState("finished");
  }, []);

  // Check and update highscore when game ends
  useEffect(() => {
    if (gameState === "finished" && score > highscore) {
      setHighscore(score);
      setStoredHighscore(score);
      setIsNewHighscore(true);
    }
  }, [gameState, score, highscore]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, endGame]);

  const handleAnswer = (optionId: number) => {
    if (gameState !== "playing" || selectedAnswer !== null || !question) return;

    setSelectedAnswer(optionId);
    const isCorrect = optionId === question.correctAnswer.id;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setFeedback({ correct: isCorrect });

    // Quick transition to next question
    setTimeout(() => {
      nextQuestion();
    }, 500);
  };

  const resetGame = () => {
    setGameState("idle");
    setScore(0);
    setTimeLeft(INITIAL_TIME);
    setQuestion(null);
    setFeedback(null);
    setSelectedAnswer(null);
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Time Challenge
          </span>
          {gameState === "playing" && (
            <div className="flex items-center gap-4">
              <span className="text-sm bg-primary-foreground/20 px-3 py-1 rounded-full">
                Skor: {score}
              </span>
              <span className="flex items-center gap-1 text-sm bg-primary-foreground/20 px-3 py-1 rounded-full">
                <Timer className="h-4 w-4" />
                {timeLeft}s
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Idle State */}
        {gameState === "idle" && (
          <div className="text-center py-8">
            <Zap className="h-16 w-16 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Time Challenge</h3>
            <p className="text-muted-foreground mb-4">
              Jawab sebanyak mungkin dalam 30 detik!
              <br />
              Soal acak tentang urutan & posisi bulan Hijriyah.
            </p>
            {highscore > 0 && (
              <div className="mb-4 inline-flex items-center gap-2 bg-accent/50 px-4 py-2 rounded-full">
                <Trophy className="h-5 w-5 text-accent-foreground" />
                <span className="font-semibold">Skor Tertinggi: {highscore}</span>
              </div>
            )}
            <div>
              <Button onClick={startGame} size="lg">
                <Play className="h-5 w-5 mr-2" />
                Mulai Tantangan
              </Button>
            </div>
          </div>
        )}

        {/* Playing State */}
        {gameState === "playing" && question && (
          <>
            {/* Timer Progress */}
            <div className="mb-4">
              <Progress value={(timeLeft / INITIAL_TIME) * 100} className="h-2" />
            </div>

            {/* Pertanyaan */}
            <div className="bg-muted p-4 rounded-lg text-center mb-4">
              <p className="text-lg font-semibold">{question.questionText}</p>
            </div>

            {/* Quick Feedback */}
            {feedback && (
              <div className="flex justify-center mb-3">
                {feedback.correct ? (
                  <Check className="h-6 w-6 text-success" />
                ) : (
                  <X className="h-6 w-6 text-destructive" />
                )}
              </div>
            )}

            {/* Pilihan Jawaban */}
            <div className="grid grid-cols-2 gap-2">
              {question.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrect = option.id === question.correctAnswer.id;
                const showResult = selectedAnswer !== null;

                let buttonClass = "h-auto py-3 text-left justify-start";
                if (showResult && isCorrect) {
                  buttonClass += " bg-success text-success-foreground hover:bg-success";
                } else if (showResult && isSelected && !isCorrect) {
                  buttonClass += " bg-destructive text-destructive-foreground hover:bg-destructive";
                }

                return (
                  <Button
                    key={option.id}
                    variant="outline"
                    className={buttonClass}
                    onClick={() => handleAnswer(option.id)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="font-medium">{option.name}</span>
                  </Button>
                );
              })}
            </div>
          </>
        )}

        {/* Finished State */}
        {gameState === "finished" && (
          <div className="text-center py-8">
            {isNewHighscore ? (
              <>
                <Trophy className="h-16 w-16 mx-auto text-accent-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-accent-foreground">🎉 Rekor Baru!</h3>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">⏱️</div>
                <h3 className="text-xl font-semibold mb-2">Waktu Habis!</h3>
              </>
            )}
            <p className="text-3xl font-bold text-primary mb-2">{score}</p>
            <p className="text-muted-foreground mb-2">jawaban benar dalam 30 detik</p>
            {!isNewHighscore && highscore > 0 && (
              <p className="text-sm text-muted-foreground mb-4">
                Skor Tertinggi: {highscore}
              </p>
            )}
            <div className="mt-4">
              <Button onClick={startGame} size="lg" className="mr-2">
                <Play className="h-5 w-5 mr-2" />
                Main Lagi
              </Button>
              <Button onClick={resetGame} variant="outline" size="lg">
                <RotateCcw className="h-5 w-5 mr-2" />
                Kembali
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
