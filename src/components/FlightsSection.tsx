import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plane, ArrowRight } from 'lucide-react';
import { searchFlights } from '@/lib/amadeus';
import type { Flight } from '@/lib/types';
import { saveBooking } from '@/lib/bookings';
import { toast } from '@/hooks/use-toast';
import FlightTicket from './FlightTicket';

export default function FlightsSection() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookedFlight, setBookedFlight] = useState<Flight | null>(null);
  const [bookingRef, setBookingRef] = useState('');

  const handleSearch = async () => {
    if (!origin || !destination || !date) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setError('');
    setFlights([]);
    try {
      const results = await searchFlights(origin.toUpperCase(), destination.toUpperCase(), date);
      setFlights(results);
      if (results.length === 0) setError('No flights found for this route and date.');
    } catch (err: any) {
      setError(err.message || 'Failed to search flights');
    }
    setLoading(false);
  };

  const handleBook = async (flight: Flight) => {
    const { booking, error } = await saveBooking('flight', {
      ...flight,
      date,
    }, Number(flight.price));
    if (error) {
      toast({ title: 'Booking failed', description: error, variant: 'destructive' });
      return;
    }
    setBookedFlight(flight);
    setBookingRef(booking!.booking_ref);
    toast({ title: '✈️ Flight booked successfully!' });
  };

  const formatTime = (time: string) =>
    new Date(time).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });

  const formatDuration = (dur: string) => {
    const h = dur.match(/(\d+)H/);
    const m = dur.match(/(\d+)M/);
    return `${h ? h[1] + 'h ' : ''}${m ? m[1] + 'm' : ''}`;
  };

  const formatPrice = (amount: string) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(amount));

  if (bookedFlight) {
    return (
      <FlightTicket
        flight={bookedFlight}
        bookingRef={bookingRef}
        date={date}
        onBack={() => setBookedFlight(null)}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4 font-[Poppins]">Search Flights</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">From</label>
            <Input placeholder="DEL" maxLength={3} value={origin} onChange={e => setOrigin(e.target.value.toUpperCase())} className="uppercase" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">To</label>
            <Input placeholder="BOM" maxLength={3} value={destination} onChange={e => setDestination(e.target.value.toUpperCase())} className="uppercase" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Date</label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} disabled={loading} className="w-full">
              {loading ? 'Searching...' : 'Search Flights'}
            </Button>
          </div>
        </div>
      </Card>

      {error && <p className="text-center text-destructive">{error}</p>}

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />)}
        </div>
      )}

      {!loading && flights.length > 0 && (
        <div className="space-y-4">
          {flights.map((flight, i) => (
            <Card key={i} className="p-5 hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plane className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{flight.airline} {flight.flight_number}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>{flight.departure_airport}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span>{flight.arrival_airport}</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{formatTime(flight.departure_time)} — {formatTime(flight.arrival_time)}</p>
                  <p className="text-xs">Duration: {formatDuration(flight.duration)}</p>
                </div>
                <div className="text-right flex items-center gap-4">
                  <p className="text-xl font-bold text-primary">{formatPrice(flight.price)}</p>
                  <Button onClick={() => handleBook(flight)} size="sm">Book Now</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && flights.length === 0 && !error && (
        <p className="text-center text-muted-foreground py-8">Search for flights to see results</p>
      )}
    </div>
  );
}
