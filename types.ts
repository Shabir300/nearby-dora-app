
export interface ProgramLocation {
  lat: number;
  lng: number;
}

export interface Program {
  id: string;
  name: string;
  venue: string;
  address: string;
  location: ProgramLocation;
  contact: string;
  organizer: string;
  timing?: string;
  /* Updated category type to include Ramadan-specific categories used in the application */
  category: 'Education' | 'Community' | 'Religious' | 'Sports' | 'Social' | 'Iftar' | 'Taraweeh' | 'Charity';
  googleMapsLink: string;
  distance?: number; // km
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}
