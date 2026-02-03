export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface HijriDate {
  date: string;
  format: string;
  day: string;
  weekday: { en: string; ar: string };
  month: { number: number; en: string; ar: string };
  year: string;
  designation: { abbreviated: string; expanded: string };
}

export interface AladhanResponse {
  code: number;
  status: string;
  data: {
    timings: PrayerTimings;
    date: {
      readable: string;
      timestamp: string;
      hijri: HijriDate;
      gregorian: {
        date: string;
        format: string;
        day: string;
        weekday: { en: string };
        month: { number: number; en: string };
        year: string;
      };
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
        params: { Fajr: number; Isha: number };
      };
      latitudeAdjustmentMethod: string;
      midnightMode: string;
      school: string;
      offset: { [key: string]: number };
    };
  };
}

// University of Islamic Sciences, Karachi method (ID 1) is standard for Pakistan
const METHOD_ID = 1; 

export const getPrayerTimes = async (lat: number, lng: number, dateObj?: Date): Promise<AladhanResponse['data'] | null> => {
  try {
    const date = dateObj || new Date();
    // Format date as DD-MM-YYYY required by Aladhan API
    const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    
    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=${METHOD_ID}&school=1`; // school=1 is Hanafi (common in Pakistan)

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching prayer times: ${response.statusText}`);
    }

    const json: AladhanResponse = await response.json();
    if (json.code !== 200) {
      throw new Error(`API Error: ${json.status}`);
    }

    return json.data;
  } catch (error) {
    console.error("Failed to fetch prayer times:", error);
    return null;
  }
};
