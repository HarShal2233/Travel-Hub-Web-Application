export interface Flight {
  airline: string;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  price: string;
}

export interface Hotel {
  hotelId: string;
  name: string;
  city: string;
  rating: string;
  price: string;
  checkIn?: string;
  checkOut?: string;
}

export interface TrainOption {
  id: string;
  trainName: string;
  trainNumber: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  class: string;
  availableSeats: number;
  price: number;
  daysOfOperation: string;
}

export type TrainClass = 'SL' | '3A' | '2A' | '1A' | 'CC' | 'GN';

export const TRAIN_CLASSES: Record<TrainClass, { label: string; multiplier: number }> = {
  GN: { label: 'General', multiplier: 0.4 },
  SL: { label: 'Sleeper', multiplier: 1 },
  '3A': { label: 'AC 3-Tier', multiplier: 1.8 },
  '2A': { label: 'AC 2-Tier', multiplier: 2.5 },
  '1A': { label: 'AC First Class', multiplier: 3.8 },
  CC: { label: 'AC Chair Car', multiplier: 1.5 },
};

export interface TravelPackage {
  id: string;
  name: string;
  destination: string;
  category: 'domestic' | 'international' | 'adventure';
  duration: string;
  durationDays: number;
  price: number;
  originalPrice: number;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: number; title: string; description: string }[];
  image: string;
  rating: number;
  reviews: number;
  maxGroupSize: number;
  difficulty?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  type: 'flight' | 'hotel' | 'train' | 'package';
  booking_ref: string;
  details: Record<string, any>;
  total_price: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}
