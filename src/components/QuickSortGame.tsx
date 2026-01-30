import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HIJRI_MONTHS, shuffleArray } from "@/lib/hijriData";
import { ArrowUpDown, Play, RotateCcw, Timer, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TIME_LIMIT = 20;
const ITEMS_COUNT = 5;
const HIGHSCORE_KEY = "hijri-quicksort-highscore";

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
  } catch {}
}

interface SortableItemProps {
  id: string;
  name: string;
  disabled: boolean;
}

function SortableItem({ id, name, disabled }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-3 p-3 bg-background border rounded-lg cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50 shadow-lg" : ""
      } ${disabled ? "cursor-default" : ""}`}
    >
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium">{name}</span>
    </div>
  );
}

function generateItems(): typeof HIJRI_MONTHS[number][] {
  // Pick 5 consecutive months randomly
  const startIndex = Math.floor(Math.random() * 8);
  const items = HIJRI_MONTHS.slice(startIndex, startIndex + ITEMS_COUNT);
  return shuffleArray([...items]);
}

export function QuickSortGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [items, setItems] = useState<typeof HIJRI_MONTHS[number][]>([]);
  const [correctOrder, setCorrectOrder] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [highscore, setHighscore] = useState(getStoredHighscore);
  const [isNewHighscore, setIsNewHighscore] = useState(false);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const startRound = useCallback(() => {
    const newItems = generateItems();
    setItems(newItems);
    setCorrectOrder([...newItems].sort((a, b) => a.id - b.id).map(m => m.id));
    setResult(null);
  }, []);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setRound(1);
    setTimeLeft(TIME_LIMIT);
    setIsNewHighscore(false);
    startRound();
  };

  const endGame = useCallback(() => {
    setGameState("finished");
  }, []);

  // Timer
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

  // Check highscore
  useEffect(() => {
    if (gameState === "finished" && score > highscore) {
      setHighscore(score);
      setStoredHighscore(score);
      setIsNewHighscore(true);
    }
  }, [gameState, score, highscore]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id.toString() === active.id);
        const newIndex = items.findIndex((item) => item.id.toString() === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const checkOrder = () => {
    const currentOrder = items.map(m => m.id);
    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setResult("correct");
      setTimeout(() => {
        setRound(prev => prev + 1);
        startRound();
      }, 800);
    } else {
      setResult("wrong");
      setTimeout(() => {
        startRound();
      }, 800);
    }
  };

  const resetGame = () => {
    setGameState("idle");
    setScore(0);
    setRound(0);
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Urutkan Cepat
          </span>
          {gameState === "playing" && (
            <div className="flex items-center gap-3">
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
        {/* Idle */}
        {gameState === "idle" && (
          <div className="text-center py-8">
            <ArrowUpDown className="h-16 w-16 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Urutkan Cepat</h3>
            <p className="text-muted-foreground mb-4">
              Susun 5 bulan dengan urutan benar secepat mungkin!
              <br />
              Waktu: {TIME_LIMIT} detik
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
                Mulai
              </Button>
            </div>
          </div>
        )}

        {/* Playing */}
        {gameState === "playing" && (
          <>
            <div className="mb-4">
              <Progress value={(timeLeft / TIME_LIMIT) * 100} className="h-2" />
            </div>

            <p className="text-sm text-muted-foreground text-center mb-3">
              Ronde {round} • Susun dari awal ke akhir:
            </p>

            {result && (
              <div className={`text-center py-2 mb-3 rounded-lg ${
                result === "correct" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
              }`}>
                {result === "correct" ? "✓ Benar!" : "✗ Salah!"}
              </div>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((item) => item.id.toString())}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <SortableItem
                      key={item.id}
                      id={item.id.toString()}
                      name={item.name}
                      disabled={result !== null}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <Button onClick={checkOrder} className="w-full" disabled={result !== null}>
              Cek Urutan
            </Button>
          </>
        )}

        {/* Finished */}
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
            <p className="text-muted-foreground mb-2">ronde berhasil</p>
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
