import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MapPin, Calendar, Star, Users, Check, X, Clock } from 'lucide-react';
import type { TravelPackage } from '@/lib/types';
import { saveBooking } from '@/lib/bookings';
import { toast } from '@/hooks/use-toast';
import PackageTicket from './PackageTicket';

interface Props {
  pkg: TravelPackage;
  onBack: () => void;
}

export default function PackageDetail({ pkg, onBack }: Props) {
  const [booked, setBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [booking, setBooking] = useState(false);

  const handleBook = async () => {
    setBooking(true);
    const { booking: b, error } = await saveBooking('package', {
      name: pkg.name,
      destination: pkg.destination,
      duration: pkg.duration,
      category: pkg.category,
    }, pkg.price);

    if (error) {
      toast({ title: 'Booking failed', description: error, variant: 'destructive' });
      setBooking(false);
      return;
    }
    setBookingRef(b!.booking_ref);
    setBooked(true);
    setBooking(false);
    toast({ title: '🎉 Package booked successfully!' });
  };

  if (booked) {
    return <PackageTicket pkg={pkg} bookingRef={bookingRef} onBack={onBack} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" /> Back to Packages</Button>

      {/* Hero image */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
        <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <span className="bg-primary px-3 py-1 rounded-full text-xs font-semibold uppercase mb-2 inline-block">{pkg.category}</span>
          <h1 className="text-3xl font-bold font-[Poppins]">{pkg.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-white/80">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {pkg.destination}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {pkg.duration}</span>
            <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-accent text-accent" /> {pkg.rating} ({pkg.reviews} reviews)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground font-[Poppins] mb-3">About This Package</h2>
            <p className="text-muted-foreground">{pkg.description}</p>
          </Card>

          {/* Itinerary */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground font-[Poppins] mb-4">Day-by-Day Itinerary</h2>
            <div className="space-y-4">
              {pkg.itinerary.map((day, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                      {day.day}
                    </div>
                    {i < pkg.itinerary.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-4">
                    <h3 className="font-semibold text-foreground">{day.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{day.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Inclusions / Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" /> Inclusions
              </h3>
              <ul className="space-y-2">
                {pkg.inclusions.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                    <Check className="w-3 h-3 text-primary shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <X className="w-4 h-4 text-destructive" /> Exclusions
              </h3>
              <ul className="space-y-2">
                {pkg.exclusions.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                    <X className="w-3 h-3 text-destructive shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Sidebar - Booking */}
        <div>
          <Card className="p-6 sticky top-24">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground line-through">₹{pkg.originalPrice.toLocaleString('en-IN')}</p>
              <p className="text-3xl font-bold text-primary">₹{pkg.price.toLocaleString('en-IN')}</p>
              <p className="text-sm text-muted-foreground">per person</p>
              <p className="text-xs font-semibold mt-1" style={{ color: 'hsl(var(--success))' }}>
                Save ₹{(pkg.originalPrice - pkg.price).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Duration</span>
                <span className="font-medium text-foreground">{pkg.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" /> Group Size</span>
                <span className="font-medium text-foreground">Max {pkg.maxGroupSize}</span>
              </div>
              {pkg.difficulty && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Difficulty</span>
                  <span className="font-medium text-foreground">{pkg.difficulty}</span>
                </div>
              )}
            </div>

            <Button onClick={handleBook} disabled={booking} className="w-full" size="lg">
              {booking ? 'Booking...' : 'Book Now'}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">Free cancellation up to 48 hours before departure</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
