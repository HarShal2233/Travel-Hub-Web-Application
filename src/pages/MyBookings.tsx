import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plane, Hotel, Train, Package, Calendar, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getBookings } from '@/lib/bookings';
import type { Booking } from '@/lib/types';

const typeIcons: Record<string, any> = { flight: Plane, hotel: Hotel, train: Train, package: Package };
const typeLabels: Record<string, string> = { flight: '✈️ Flight', hotel: '🏨 Hotel', train: '🚂 Train', package: '📦 Package' };
const typeFilters = ['all', 'flight', 'hotel', 'train', 'package'] as const;

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    getBookings().then(b => { setBookings(b); setLoading(false); });
  }, []);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.type === filter);

  const getStatusColor = (status: string) => {
    if (status === 'confirmed') return 'bg-primary/10 text-primary border-primary/20';
    if (status === 'completed') return 'bg-muted text-muted-foreground border-border';
    return 'bg-destructive/10 text-destructive border-destructive/20';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-1 font-[Poppins]">My Bookings</h1>
          <p className="text-muted-foreground mb-6">View and manage all your travel bookings</p>

          <div className="flex gap-2 mb-6 flex-wrap">
            {typeFilters.map(f => (
              <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)} className="capitalize">
                {f === 'all' ? 'All' : typeLabels[f]}
                <span className="ml-1 text-xs opacity-70">
                  ({f === 'all' ? bookings.length : bookings.filter(b => b.type === f).length})
                </span>
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />)}
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map(booking => {
                const Icon = typeIcons[booking.type] || Plane;
                const details = booking.details || {};
                return (
                  <Card key={booking.id} className="p-5 hover:shadow-lg transition">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {booking.type === 'flight' && `${details.departure_airport || 'N/A'} → ${details.arrival_airport || 'N/A'}`}
                            {booking.type === 'hotel' && (details.name || 'Hotel Booking')}
                            {booking.type === 'train' && `${details.from || 'N/A'} → ${details.to || 'N/A'}`}
                            {booking.type === 'package' && (details.name || 'Package Booking')}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(booking.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{booking.booking_ref}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">₹{booking.total_price.toLocaleString('en-IN')}</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded border capitalize ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Plane className="w-12 h-12 text-muted-foreground mx-auto opacity-50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">Start your journey by booking a flight, hotel, train, or package!</p>
              <Link to="/"><Button>Browse Travel Options</Button></Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
