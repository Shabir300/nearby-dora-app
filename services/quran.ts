
import { CHAPTERS } from './chapters';

const BASE_URL = "https://api.alquran.cloud/v1";

export const QuranService = {
  getJuz: async (juzId: number | string) => {
    try {
      const id = Number(juzId);
      if (id < 1 || id > 30) throw new Error("Invalid Juz ID");

      // Fetch Arabic and Urdu separately since combined Juz endpoint fails
      const [arabicRes, urduRes] = await Promise.all([
        fetch(`${BASE_URL}/juz/${id}/quran-uthmani`),
        fetch(`${BASE_URL}/juz/${id}/ur.maududi`)
      ]);
      
      if (!arabicRes.ok || !urduRes.ok) throw new Error("Failed to fetch Juz data");
      
      const arabicData = await arabicRes.json();
      const urduData = await urduRes.json();

      if (arabicData.status !== "OK" || urduData.status !== "OK") throw new Error("API Error");

      return arabicData.data.ayahs.map((v: any, index: number) => ({
        id: v.number,
        verse_key: `${v.surah.number}:${v.numberInSurah}`,
        text_arabic: v.text,
        text_urdu: urduData.data.ayahs[index]?.text || "Translation unavailable",
        surah_id: v.surah.number,
        surah_name: v.surah.englishName,
        ayah_id: v.numberInSurah,
        is_bismillah: false
      }));

    } catch (error) {
      console.error("Quran Service Error:", error);
      return [];
    }
  },

  getChapters: async () => {
    return CHAPTERS;
  },

  getSurah: async (surahId: number | string) => {
    try {
      const id = Number(surahId);
      
      // Fetch Surah with Arabic (Uthmani) and Urdu (Maududi)
      const res = await fetch(`${BASE_URL}/surah/${id}/editions/quran-uthmani,ur.maududi`);

      if (!res.ok) throw new Error("Failed to fetch Surah data");
      const data = await res.json();
      
      if (data.status !== "OK") throw new Error(data.data || "API Error");

      const arabicEdition = data.data[0];
      const urduEdition = data.data[1];

      if (!arabicEdition || !urduEdition) throw new Error("Missing edition data");

      return arabicEdition.ayahs.map((v: any, index: number) => ({
        id: v.number,
        verse_key: `${id}:${v.numberInSurah}`,
        text_arabic: v.text,
        text_urdu: urduEdition.ayahs[index]?.text || "Translation unavailable",
        surah_id: id,
        surah_name: arabicEdition.englishName,
        ayah_id: v.numberInSurah,
        is_bismillah: v.text.includes("بِسْمِ ٱللَّهِ") && v.numberInSurah === 1 && id !== 1 && id !== 9
      }));
    } catch (error) {
      console.error("Quran Service Error:", error);
      return [];
    }
  }
};
