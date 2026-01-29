import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HijriCalendar } from "@/components/HijriCalendar";
import { SortingGame } from "@/components/SortingGame";
import { QuizGame } from "@/components/QuizGame";
import { BeforeAfterGame } from "@/components/BeforeAfterGame";
import { TimeChallengeGame } from "@/components/TimeChallengeGame";
import { Calendar, Gamepad2, Moon, BookOpen, ArrowLeftRight, Zap } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("calendar");

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
              value="calendar" 
              className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Calendar className="h-5 w-5" />
              Kalender
            </TabsTrigger>
            <TabsTrigger 
              value="game" 
              className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Gamepad2 className="h-5 w-5" />
              Game
            </TabsTrigger>
          </TabsList>

          {/* Mode Kalender */}
          <TabsContent value="calendar" className="mt-0">
            <HijriCalendar />
          </TabsContent>

          {/* Mode Game */}
          <TabsContent value="game" className="space-y-6 mt-0">
            {/* Pilih Jenis Game */}
            <Tabs defaultValue="sorting" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-12">
                <TabsTrigger value="sorting" className="flex items-center gap-1 text-xs sm:text-sm px-2">
                  <BookOpen className="h-4 w-4 hidden sm:block" />
                  Susun
                </TabsTrigger>
                <TabsTrigger value="quiz" className="flex items-center gap-1 text-xs sm:text-sm px-2">
                  <Gamepad2 className="h-4 w-4 hidden sm:block" />
                  Quiz
                </TabsTrigger>
                <TabsTrigger value="beforeafter" className="flex items-center gap-1 text-xs sm:text-sm px-2">
                  <ArrowLeftRight className="h-4 w-4 hidden sm:block" />
                  Urutan
                </TabsTrigger>
                <TabsTrigger value="timechallenge" className="flex items-center gap-1 text-xs sm:text-sm px-2">
                  <Zap className="h-4 w-4 hidden sm:block" />
                  Tantangan
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="sorting" className="mt-4">
                <SortingGame />
              </TabsContent>
              
              <TabsContent value="quiz" className="mt-4">
                <QuizGame />
              </TabsContent>
              
              <TabsContent value="beforeafter" className="mt-4">
                <BeforeAfterGame />
              </TabsContent>
              
              <TabsContent value="timechallenge" className="mt-4">
                <TimeChallengeGame />
              </TabsContent>
            </Tabs>
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
