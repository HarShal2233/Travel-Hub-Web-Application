import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Train, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { mockTrains, CITIES } from '@/lib/mock-data';
import { TRAIN_CLASSES, type TrainClass, type TrainOption } from '@/lib/types';
import { saveBooking } from '@/lib/bookings';
import { toast } from '@/hooks/use-toast';
import TrainTicket from './TrainTicket';

export default function TrainsSection() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<TrainClass>('3A');
  const [searched, setSearched] = useState(false);
  const [bookedTrain, setBookedTrain] = useState<TrainOption | null>(null);
  const [bookingRef, setBookingRef] = useState('');
  const [bookingClass, setBookingClass] = useState<TrainClass>('3A');

  const results = useMemo(() => {
    if (!searched) return [];
    const src = source.toUpperCase();
    const dst = destination.toUpperCase();
    let filtered = mockTrains;

    if (src || dst) {
      filtered = mockTrains.filter(t => {
        const depMatch = !src || t.departureStation.toLowerCase().includes(CITIES[src]?.toLowerCase() || src.toLowerCase());
        const arrMatch = !dst || t.arrivalStation.toLowerCase().includes(CITIES[dst]?.toLowerCase() || dst.toLowerCase());
        return depMatch && arrMatch;
      });
    }

    if (filtered.length === 0) filtered = mockTrains.slice(0, 8);
    return filtered;
  }, [searched, source, destination]);

  const getPrice = (basePrice: number, cls: TrainClass) =>
    Math.round(basePrice * TRAIN_CLASSES[cls].multiplier);

  const handleSearch = () => setSearched(true);

  const handleBook = async (train: TrainOption) => {
    const price = getPrice(train.price, selectedClass);
    const { booking, error } = await saveBooking('train', {
      trainName: train.trainName,
      trainNumber: train.trainNumber,
      from: train.departureStation,
      to: train.arrivalStation,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      duration: train.duration,
      class: TRAIN_CLASSES[selectedClass].label,
      date,
    }, price);

    if (error) {
      toast({ title: 'Booking failed', description: error, variant: 'destructive' });
      return;
    }
    setBookedTrain(train);
    setBookingRef(booking!.booking_ref);
    setBookingClass(selectedClass);
    toast({ title: '🚂 Train booked successfully!' });
  };

  if (bookedTrain) {
    return (
      <TrainTicket
        train={bookedTrain}
        bookingRef={bookingRef}
        date={date}
        trainClass={TRAIN_CLASSES[bookingClass].label}
        price={getPrice(bookedTrain.price, bookingClass)}
        onBack={() => setBookedTrain(null)}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4 font-[Poppins]">Search Trains</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">From</label>
            <Input placeholder="DEL / Delhi" value={source} onChange={e => setSource(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">To</label>
            <Input placeholder="MUM / Mumbai" value={destination} onChange={e => setDestination(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Date</label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Class</label>
            <Select value={selectedClass} onValueChange={v => setSelectedClass(v as TrainClass)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(TRAIN_CLASSES).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} className="w-full">Search Trains</Button>
          </div>
        </div>
      </Card>

      {searched && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{results.length} trains found</p>
          {results.map(train => (
            <Card key={train.id} className="p-5 hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <Train className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{train.trainName}</p>
                    <p className="text-xs text-muted-foreground">{train.trainNumber} • {train.daysOfOperation}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div>
                        <p className="text-lg font-bold text-foreground">{train.departureTime}</p>
                        <p className="text-xs text-muted-foreground">{train.departureStation}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <p className="text-xs text-muted-foreground">{train.duration}</p>
                        <div className="w-full h-px bg-border relative">
                          <ArrowRight className="w-3 h-3 text-muted-foreground absolute right-0 -top-1.5" />
                        </div>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">{train.arrivalTime}</p>
                        <p className="text-xs text-muted-foreground">{train.arrivalStation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:flex-col md:items-end">
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">₹{getPrice(train.price, selectedClass).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-muted-foreground">{TRAIN_CLASSES[selectedClass].label}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{train.availableSeats} seats</span>
                  </div>
                  <Button onClick={() => handleBook(train)} size="sm">Book Now</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {searched && results.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No trains found. Try different cities.</p>
      )}

      {!searched && (
        <p className="text-center text-muted-foreground py-8">Search for trains to see available options</p>
      )}
    </div>
  );
}
