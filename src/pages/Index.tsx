import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HijriCalendar } from "@/components/HijriCalendar";
import { SortingGame } from "@/components/SortingGame";
import { QuizGame } from "@/components/QuizGame";
import { Calendar, Gamepad2, Moon, BookOpen } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("game");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4">
        <div className="container max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Moon className="h-8 w-8" />
            <h1 className="text-2xl sm:text-3xl font-bold">Hafal Bulan Hijriyah</h1>
          </div>
          <p className="text-primary-foreground/80 text-sm sm:text-base">
            Belajar & hafal 12 bulan dalam kalender Islam dengan cara menyenangkan
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto py-6 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Toggle Tab */}
          <TabsList className="grid w-full grid-cols-2 mb-6 h-14">
            <TabsTrigger 
              value="game" 
              className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Gamepad2 className="h-5 w-5" />
              Game
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Calendar className="h-5 w-5" />
              Kalender
            </TabsTrigger>
          </TabsList>

          {/* Mode Game */}
          <TabsContent value="game" className="space-y-6 mt-0">
            {/* Pilih Jenis Game */}
            <Tabs defaultValue="sorting" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="sorting" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Susun Urutan
                </TabsTrigger>
                <TabsTrigger value="quiz" className="flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4" />
                  Pilihan Ganda
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="sorting" className="mt-4">
                <SortingGame />
              </TabsContent>
              
              <TabsContent value="quiz" className="mt-4">
                <QuizGame />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Mode Kalender */}
          <TabsContent value="calendar" className="mt-0">
            <HijriCalendar />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 text-center text-muted-foreground text-sm border-t border-border mt-8">
        <p>Game Edukasi Islami • Ramah Anak • Bahasa Indonesia</p>
      </footer>
    </div>
  );
};

export default Index;
