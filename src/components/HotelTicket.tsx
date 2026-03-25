import { Hotel, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Hotel as HotelType } from '@/lib/types';

interface Props {
  hotel: HotelType;
  bookingRef: string;
  checkIn: string;
  checkOut: string;
  onBack: () => void;
}

export default function HotelTicket({ hotel, bookingRef, checkIn, checkOut, onBack }: Props) {
  const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4">← Back to Search</Button>
      <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
        <div className="bg-gradient-to-r from-accent to-primary p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Hotel className="w-6 h-6" />
              <span className="text-xl font-bold font-[Poppins]">TravelHub</span>
            </div>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">🏨 Hotel Voucher</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">{hotel.name}</h2>
            <p className="text-muted-foreground flex items-center justify-center gap-1 mt-1">
              <MapPin className="w-4 h-4" /> {hotel.city}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">CHECK-IN</p>
              <p className="font-semibold text-foreground">{new Date(checkIn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              <p className="text-xs text-muted-foreground">After 2:00 PM</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">CHECK-OUT</p>
              <p className="font-semibold text-foreground">{new Date(checkOut).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              <p className="text-xs text-muted-foreground">Before 11:00 AM</p>
            </div>
          </div>

          <div className="border-t border-dashed border-border pt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Rating</p>
              <p className="font-semibold text-foreground">⭐ {hotel.rating}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-semibold text-foreground">{nights} Night{nights > 1 ? 's' : ''}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Booking Ref</p>
              <p className="font-semibold text-primary font-mono">{bookingRef}</p>
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl p-4 flex justify-between items-center">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="text-2xl font-bold text-primary">
              ₹{Number(hotel.price).toLocaleString('en-IN')}
            </span>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Status: <span className="font-semibold" style={{ color: 'hsl(var(--success))' }}>CONFIRMED</span> • Booking saved to your account
          </p>
        </div>
      </div>
    </div>
  );
}
