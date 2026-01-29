import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HIJRI_MONTHS, shuffleArray, HijriMonth } from "@/lib/hijriData";
import { RotateCcw, Check, X, Trophy, GripVertical } from "lucide-react";
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

interface SortableItemProps {
  month: HijriMonth;
  index: number;
  isComplete: boolean;
  isCorrect: boolean;
}

function SortableItem({ month, index, isComplete, isCorrect }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: month.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
        isDragging
          ? "border-primary bg-primary/20 shadow-lg z-10"
          : isComplete && isCorrect
          ? "bg-success/10 border-success"
          : "border-border hover:border-primary/50 bg-card"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
        {index + 1}
      </span>
      <span className="flex-1 font-medium">{month.name}</span>
      <span className="text-muted-foreground text-sm">{month.arabic}</span>
    </div>
  );
}

export function SortingGame() {
  const [months, setMonths] = useState<HijriMonth[]>([]);
  const [score, setScore] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setMonths(shuffleArray([...HIJRI_MONTHS]));
    setScore(0);
    setFeedback(null);
    setIsComplete(false);
    setIsChecking(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setMonths((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const checkOrder = () => {
    setIsChecking(true);

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
          Geser dan susun 12 bulan Hijriyah dari Muharram hingga Dzulhijjah
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

        {/* Daftar Bulan dengan Drag & Drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={months.map((m) => m.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 mb-4">
              {months.map((month, index) => (
                <SortableItem
                  key={month.id}
                  month={month}
                  index={index}
                  isComplete={isComplete}
                  isCorrect={month.id === index + 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

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
          <Button variant="outline" onClick={resetGame}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Acak Ulang
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
