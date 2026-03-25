import { Train, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TrainOption } from '@/lib/types';

interface Props {
  train: TrainOption;
  bookingRef: string;
  date: string;
  trainClass: string;
  price: number;
  onBack: () => void;
}

export default function TrainTicket({ train, bookingRef, date, trainClass, price, onBack }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4">← Back to Search</Button>
      <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
        <div className="bg-gradient-to-r from-secondary to-secondary/80 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Train className="w-6 h-6" />
              <span className="text-xl font-bold font-[Poppins]">TravelHub</span>
            </div>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">🚂 Train Ticket</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">{train.trainName}</h2>
            <p className="text-sm text-muted-foreground">Train No: {train.trainNumber}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{train.departureTime}</p>
              <p className="text-sm text-muted-foreground">{train.departureStation}</p>
            </div>
            <div className="flex-1 mx-6 flex flex-col items-center">
              <p className="text-xs text-muted-foreground mb-1">{train.duration}</p>
              <div className="w-full flex items-center">
                <div className="flex-1 h-px bg-border" />
                <Train className="w-4 h-4 text-secondary mx-2" />
                <div className="flex-1 h-px bg-border" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{train.arrivalTime}</p>
              <p className="text-sm text-muted-foreground">{train.arrivalStation}</p>
            </div>
          </div>

          <div className="border-t border-dashed border-border pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">PNR No</p>
              <p className="font-semibold text-primary font-mono">{bookingRef}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-semibold text-foreground">{new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Class</p>
              <p className="font-semibold text-foreground">{trainClass}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Coach/Seat</p>
              <p className="font-semibold text-foreground">B{Math.floor(Math.random() * 5) + 1}/{Math.floor(Math.random() * 72) + 1}</p>
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl p-4 flex justify-between items-center">
            <span className="text-muted-foreground">Total Fare</span>
            <span className="text-2xl font-bold text-primary">₹{price.toLocaleString('en-IN')}</span>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Status: <span className="font-semibold" style={{ color: 'hsl(var(--success))' }}>CONFIRMED</span> • PNR saved to your account
          </p>
        </div>
      </div>
    </div>
  );
}
