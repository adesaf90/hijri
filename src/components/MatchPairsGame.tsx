import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HIJRI_MONTHS, shuffleArray } from "@/lib/hijriData";
import { Link2, RotateCcw, Check, Trophy, Play } from "lucide-react";

interface MatchItem {
  id: number;
  name: string;
  position: number;
}

function generateRound(): { items: MatchItem[]; shuffledPositions: number[] } {
  // Pick 4 random months
  const shuffled = shuffleArray([...HIJRI_MONTHS]);
  const selected = shuffled.slice(0, 4);
  
  const items: MatchItem[] = selected.map(month => ({
    id: month.id,
    name: month.name,
    position: month.id, // position is 1-indexed same as id
  }));
  
  // Shuffle positions for the right column
  const shuffledPositions = shuffleArray(items.map(item => item.position));
  
  return { items, shuffledPositions };
}

export function MatchPairsGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [items, setItems] = useState<MatchItem[]>([]);
  const [shuffledPositions, setShuffledPositions] = useState<number[]>([]);
  const [selectedName, setSelectedName] = useState<number | null>(null);
  const [matches, setMatches] = useState<Map<number, number>>(new Map());
  const [wrongPair, setWrongPair] = useState<{ name: number; pos: number } | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);

  const startRound = useCallback(() => {
    const { items: newItems, shuffledPositions: newPositions } = generateRound();
    setItems(newItems);
    setShuffledPositions(newPositions);
    setMatches(new Map());
    setSelectedName(null);
    setWrongPair(null);
  }, []);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setRound(1);
    startRound();
  };

  const handleNameClick = (itemId: number) => {
    if (matches.has(itemId)) return;
    setSelectedName(itemId);
    setWrongPair(null);
  };

  const handlePositionClick = (position: number) => {
    if (selectedName === null) return;
    if ([...matches.values()].includes(position)) return;
    
    const selectedItem = items.find(item => item.id === selectedName);
    if (!selectedItem) return;
    
    if (selectedItem.position === position) {
      // Correct match
      const newMatches = new Map(matches);
      newMatches.set(selectedName, position);
      setMatches(newMatches);
      setSelectedName(null);
      
      // Check if round complete
      if (newMatches.size === items.length) {
        setScore(prev => prev + 1);
        setTimeout(() => {
          setRound(prev => prev + 1);
          startRound();
        }, 800);
      }
    } else {
      // Wrong match
      setWrongPair({ name: selectedName, pos: position });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedName(null);
      }, 600);
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
            <Link2 className="h-5 w-5" />
            Pilih Pasangan
          </span>
          {gameState === "playing" && (
            <span className="text-sm bg-primary-foreground/20 px-3 py-1 rounded-full">
              Ronde: {round} • Skor: {score}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Idle */}
        {gameState === "idle" && (
          <div className="text-center py-8">
            <Link2 className="h-16 w-16 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Pilih Pasangan</h3>
            <p className="text-muted-foreground mb-6">
              Cocokkan nama bulan dengan nomor urutannya!
              <br />
              Pilih nama di kiri, lalu nomor di kanan.
            </p>
            <Button onClick={startGame} size="lg">
              <Play className="h-5 w-5 mr-2" />
              Mulai
            </Button>
          </div>
        )}

        {/* Playing */}
        {gameState === "playing" && (
          <>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Pilih nama bulan, lalu pilih nomor urutannya:
            </p>

            {matches.size === items.length && (
              <div className="text-center py-2 mb-3 rounded-lg bg-success/20 text-success">
                <Check className="h-5 w-5 inline mr-2" />
                Semua cocok! Lanjut ke ronde berikutnya...
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Names Column */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground text-center mb-2">
                  Nama Bulan
                </p>
                {items.map((item) => {
                  const isMatched = matches.has(item.id);
                  const isSelected = selectedName === item.id;
                  const isWrong = wrongPair?.name === item.id;

                  return (
                    <Button
                      key={item.id}
                      variant="outline"
                      className={`w-full justify-start ${
                        isMatched 
                          ? "bg-success/20 text-success border-success" 
                          : isWrong
                          ? "bg-destructive/20 text-destructive border-destructive"
                          : isSelected 
                          ? "bg-primary text-primary-foreground" 
                          : ""
                      }`}
                      onClick={() => handleNameClick(item.id)}
                      disabled={isMatched}
                    >
                      {item.name}
                    </Button>
                  );
                })}
              </div>

              {/* Positions Column */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground text-center mb-2">
                  Nomor Urut
                </p>
                {shuffledPositions.map((position) => {
                  const isMatched = [...matches.values()].includes(position);
                  const isWrong = wrongPair?.pos === position;

                  return (
                    <Button
                      key={position}
                      variant="outline"
                      className={`w-full ${
                        isMatched 
                          ? "bg-success/20 text-success border-success" 
                          : isWrong
                          ? "bg-destructive/20 text-destructive border-destructive"
                          : ""
                      }`}
                      onClick={() => handlePositionClick(position)}
                      disabled={isMatched || selectedName === null}
                    >
                      Bulan ke-{position}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Button onClick={resetGame} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
