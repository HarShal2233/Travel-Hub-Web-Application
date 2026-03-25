import { Package, MapPin, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TravelPackage } from '@/lib/types';

interface Props {
  pkg: TravelPackage;
  bookingRef: string;
  onBack: () => void;
}

export default function PackageTicket({ pkg, bookingRef, onBack }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4">← Back to Packages</Button>
      <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
        <div className="relative h-40 overflow-hidden">
          <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-4 left-6 text-white">
            <p className="text-sm bg-white/20 px-3 py-1 rounded-full inline-block mb-2">📦 Package Confirmation</p>
            <h2 className="text-xl font-bold font-[Poppins]">{pkg.name}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Destination</p>
              <p className="font-semibold text-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {pkg.destination}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-semibold text-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> {pkg.duration}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Category</p>
              <p className="font-semibold text-foreground capitalize">{pkg.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Booking Ref</p>
              <p className="font-semibold text-primary font-mono">{bookingRef}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Tour Highlights</p>
            <div className="flex flex-wrap gap-2">
              {pkg.highlights.map((h, i) => (
                <span key={i} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">{h}</span>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl p-4 flex justify-between items-center">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="text-2xl font-bold text-primary">₹{pkg.price.toLocaleString('en-IN')}</span>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Status: <span className="font-semibold" style={{ color: 'hsl(var(--success))' }}>CONFIRMED</span> • Booking saved to your account
          </p>
        </div>
      </div>
    </div>
  );
}
