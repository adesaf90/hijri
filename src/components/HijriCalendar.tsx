import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTodayHijri, getTodayGregorian, HIJRI_MONTHS } from "@/lib/hijriData";
import { Calendar, Moon, Star } from "lucide-react";

export function HijriCalendar() {
  const hijriDate = getTodayHijri();
  const gregorianDate = getTodayGregorian();

  return (
    <div className="space-y-6">
      {/* Kartu Tanggal Utama */}
      <Card className="overflow-hidden border-2 border-primary/20">
        <CardHeader className="bg-primary text-primary-foreground text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <Moon className="h-6 w-6" />
            Kalender Hijriyah Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          {/* Tanggal Hijriyah Besar */}
          <div className="mb-6">
            <p className="text-6xl font-bold text-primary mb-2">{hijriDate.day}</p>
            <p className="text-2xl font-semibold text-foreground">{hijriDate.monthName}</p>
            <p className="text-3xl text-muted-foreground font-arabic mt-1">{hijriDate.arabic}</p>
            <p className="text-xl text-muted-foreground mt-2">{hijriDate.year} H</p>
          </div>

          {/* Garis Pemisah */}
          <div className="border-t border-border my-4" />

          {/* Tanggal Masehi */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Calendar className="h-5 w-5" />
            <p className="text-lg">{gregorianDate}</p>
          </div>
        </CardContent>
      </Card>

      {/* Info Edukatif */}
      <Card className="border-accent/50 bg-accent/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Star className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-foreground mb-2">Tahukah Kamu?</p>
              <p className="text-muted-foreground">
                Hari ini kita berada di bulan <span className="font-semibold text-primary">{hijriDate.monthName}</span>, 
                bulan ke-{hijriDate.month} dalam kalender Hijriyah. 
                Kalender Hijriyah mengikuti peredaran bulan dan memiliki 12 bulan dalam setahun.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daftar 12 Bulan Hijriyah */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-center">12 Bulan Hijriyah</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {HIJRI_MONTHS.map((month) => (
              <div
                key={month.id}
                className={`p-3 rounded-lg text-center transition-colors ${
                  month.id === hijriDate.month
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <p className="text-sm font-medium">{month.id}. {month.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
