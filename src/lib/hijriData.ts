// Data 12 bulan Hijriyah
export const HIJRI_MONTHS = [
  { id: 1, name: "Muharram", arabic: "محرّم" },
  { id: 2, name: "Shafar", arabic: "صفر" },
  { id: 3, name: "Rabi'ul Awal", arabic: "ربيع الأوّل" },
  { id: 4, name: "Rabi'ul Akhir", arabic: "ربيع الآخر" },
  { id: 5, name: "Jumadil Ula", arabic: "جمادى الأولى" },
  { id: 6, name: "Jumadil Akhir", arabic: "جمادى الآخرة" },
  { id: 7, name: "Rajab", arabic: "رجب" },
  { id: 8, name: "Sya'ban", arabic: "شعبان" },
  { id: 9, name: "Ramadhan", arabic: "رمضان" },
  { id: 10, name: "Syawwal", arabic: "شوّال" },
  { id: 11, name: "Dzulqa'dah", arabic: "ذو القعدة" },
  { id: 12, name: "Dzulhijjah", arabic: "ذو الحجّة" },
] as const;

export type HijriMonth = typeof HIJRI_MONTHS[number];

// Fungsi untuk mendapatkan tanggal Hijriyah hari ini
export function getTodayHijri(): { day: number; month: number; year: number; monthName: string; arabic: string } {
  const today = new Date();
  
  // Menggunakan Intl.DateTimeFormat dengan kalender Islamic
  const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
  
  const parts = formatter.formatToParts(today);
  
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '1');
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '1');
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '1446');
  
  const monthData = HIJRI_MONTHS[month - 1];
  
  return {
    day,
    month,
    year,
    monthName: monthData?.name || 'Muharram',
    arabic: monthData?.arabic || 'محرّم',
  };
}

// Fungsi untuk mendapatkan tanggal Masehi hari ini
export function getTodayGregorian(): string {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return today.toLocaleDateString('id-ID', options);
}

// Fungsi untuk mengacak array
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
