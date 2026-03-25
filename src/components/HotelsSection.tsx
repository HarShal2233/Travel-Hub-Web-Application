import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Hotel, Star, MapPin } from 'lucide-react';
import { searchHotels } from '@/lib/amadeus';
import type { Hotel as HotelType } from '@/lib/types';
import { saveBooking } from '@/lib/bookings';
import { toast } from '@/hooks/use-toast';
import HotelTicket from './HotelTicket';

export default function HotelsSection() {
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookedHotel, setBookedHotel] = useState<HotelType | null>(null);
  const [bookingRef, setBookingRef] = useState('');

  const handleSearch = async () => {
    if (!city || !checkIn || !checkOut) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setError('');
    setHotels([]);
    try {
      const results = await searchHotels(city.toUpperCase(), checkIn, checkOut);
      setHotels(results);
      if (results.length === 0) setError('No hotels found for this city and dates.');
    } catch (err: any) {
      setError(err.message || 'Failed to search hotels');
    }
    setLoading(false);
  };

  const handleBook = async (hotel: HotelType) => {
    const { booking, error } = await saveBooking('hotel', {
      ...hotel,
      checkIn,
      checkOut,
    }, Number(hotel.price));
    if (error) {
      toast({ title: 'Booking failed', description: error, variant: 'destructive' });
      return;
    }
    setBookedHotel(hotel);
    setBookingRef(booking!.booking_ref);
    toast({ title: '🏨 Hotel booked successfully!' });
  };

  if (bookedHotel) {
    return (
      <HotelTicket
        hotel={bookedHotel}
        bookingRef={bookingRef}
        checkIn={checkIn}
        checkOut={checkOut}
        onBack={() => setBookedHotel(null)}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4 font-[Poppins]">Search Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">City Code</label>
            <Input placeholder="DEL" maxLength={3} value={city} onChange={e => setCity(e.target.value.toUpperCase())} className="uppercase" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Check-in</label>
            <Input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Check-out</label>
            <Input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} disabled={loading} className="w-full">
              {loading ? 'Searching...' : 'Search Hotels'}
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

      {!loading && hotels.length > 0 && (
        <div className="space-y-4">
          {hotels.map((hotel, i) => (
            <Card key={i} className="p-5 hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Hotel className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-lg">{hotel.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {hotel.city}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-accent text-accent" /> {hotel.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-xl font-bold text-primary">₹{Number(hotel.price).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-muted-foreground">per night</p>
                  </div>
                  <Button onClick={() => handleBook(hotel)} size="sm">Book Now</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && hotels.length === 0 && !error && (
        <p className="text-center text-muted-foreground py-8">Search for hotels to see results</p>
      )}
    </div>
  );
}
