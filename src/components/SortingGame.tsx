import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HIJRI_MONTHS, shuffleArray, HijriMonth } from "@/lib/hijriData";
import { ArrowUp, ArrowDown, RotateCcw, Check, X, Trophy } from "lucide-react";

export function SortingGame() {
  const [months, setMonths] = useState<HijriMonth[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setMonths(shuffleArray([...HIJRI_MONTHS]));
    setSelectedIndex(null);
    setScore(0);
    setAttempts(0);
    setFeedback(null);
    setIsComplete(false);
    setIsChecking(false);
  };

  const moveUp = (index: number) => {
    if (index === 0 || isChecking) return;
    const newMonths = [...months];
    [newMonths[index - 1], newMonths[index]] = [newMonths[index], newMonths[index - 1]];
    setMonths(newMonths);
    setSelectedIndex(index - 1);
  };

  const moveDown = (index: number) => {
    if (index === months.length - 1 || isChecking) return;
    const newMonths = [...months];
    [newMonths[index], newMonths[index + 1]] = [newMonths[index + 1], newMonths[index]];
    setMonths(newMonths);
    setSelectedIndex(index + 1);
  };

  const checkOrder = () => {
    setIsChecking(true);
    setAttempts(attempts + 1);
    
    const isCorrect = months.every((month, index) => month.id === index + 1);
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback({ correct: true, message: "Benar! Urutan bulan Hijriyah sudah tepat! 🎉" });
      setIsComplete(true);
    } else {
      setFeedback({ correct: false, message: "Salah! Coba susun ulang dengan benar." });
      setTimeout(() => {
        setFeedback(null);
        setIsChecking(false);
      }, 1500);
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Susun Urutan Bulan Hijriyah
          </span>
          <span className="text-sm bg-primary-foreground/20 px-3 py-1 rounded-full">
            Skor: {score}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Instruksi */}
        <p className="text-sm text-muted-foreground text-center mb-4">
          Susun 12 bulan Hijriyah dari Muharram hingga Dzulhijjah dengan menggeser ke atas/bawah
        </p>

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

        {/* Daftar Bulan */}
        <div className="space-y-2 mb-4">
          {months.map((month, index) => (
            <div
              key={month.id}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                selectedIndex === index
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              } ${isComplete && month.id === index + 1 ? "bg-success/10 border-success" : ""}`}
              onClick={() => !isChecking && setSelectedIndex(index)}
            >
              <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span className="flex-1 font-medium">{month.name}</span>
              <span className="text-muted-foreground text-sm">{month.arabic}</span>
              
              {selectedIndex === index && !isComplete && (
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => { e.stopPropagation(); moveUp(index); }}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => { e.stopPropagation(); moveDown(index); }}
                    disabled={index === months.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-2">
          <Button
            onClick={checkOrder}
            className="flex-1"
            disabled={isChecking || isComplete}
          >
            <Check className="h-4 w-4 mr-2" />
            Periksa Urutan
          </Button>
          <Button
            variant="outline"
            onClick={resetGame}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Acak Ulang
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
