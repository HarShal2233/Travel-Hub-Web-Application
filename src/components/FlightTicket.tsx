import { Plane, ArrowRight, Calendar, User, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Flight } from '@/lib/types';

interface Props {
  flight: Flight;
  bookingRef: string;
  date: string;
  onBack: () => void;
}

export default function FlightTicket({ flight, bookingRef, date, onBack }: Props) {
  const formatTime = (t: string) =>
    new Date(t).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4">← Back to Search</Button>
      <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary to-primary p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Plane className="w-6 h-6" />
              <span className="text-xl font-bold font-[Poppins]">TravelHub</span>
            </div>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">✈️ Flight Ticket</span>
          </div>
        </div>

        {/* Ticket body */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{flight.departure_airport}</p>
              <p className="text-sm text-muted-foreground">{formatTime(flight.departure_time)}</p>
            </div>
            <div className="flex-1 mx-6 flex items-center">
              <div className="flex-1 h-px bg-border" />
              <Plane className="w-5 h-5 text-primary mx-2" />
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{flight.arrival_airport}</p>
              <p className="text-sm text-muted-foreground">{formatTime(flight.arrival_time)}</p>
            </div>
          </div>

          <div className="border-t border-dashed border-border pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Airline</p>
              <p className="font-semibold text-foreground">{flight.airline}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Flight No</p>
              <p className="font-semibold text-foreground">{flight.flight_number}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-semibold text-foreground">{date}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Booking Ref</p>
              <p className="font-semibold text-primary font-mono">{bookingRef}</p>
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl p-4 flex justify-between items-center">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="text-2xl font-bold text-primary">
              ₹{Number(flight.price).toLocaleString('en-IN')}
            </span>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Status: <span className="text-green-600 font-semibold">CONFIRMED</span> • Booking saved to your account
          </p>
        </div>
      </div>
    </div>
  );
}
