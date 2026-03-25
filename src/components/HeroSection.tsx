import { Plane, Hotel, Train, Package } from 'lucide-react';

interface HeroSectionProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'hotels', label: 'Hotels', icon: Hotel },
  { id: 'trains', label: 'Trains', icon: Train },
  { id: 'packages', label: 'Packages', icon: Package },
];

export default function HeroSection({ activeTab, onTabChange }: HeroSectionProps) {
  return (
    <section className="relative w-full pt-16">
      {/* Hero banner */}
      <div className="relative h-[340px] md:h-[420px] overflow-hidden bg-gradient-to-br from-secondary via-secondary/90 to-primary/80">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 font-[Poppins] leading-tight">
            Your Journey Starts Here
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-8">
            Book flights, hotels, trains & holiday packages — all in one place
          </p>

          {/* Tab selector */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1.5 flex gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-secondary shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
