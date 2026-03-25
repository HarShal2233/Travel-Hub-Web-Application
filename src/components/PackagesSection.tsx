import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Calendar, Star, Users, Heart, ArrowRight } from 'lucide-react';
import { mockPackages } from '@/lib/mock-data';
import type { TravelPackage } from '@/lib/types';
import PackageDetail from './PackageDetail';

const categories = [
  { id: 'all', label: 'All Packages' },
  { id: 'domestic', label: '🇮🇳 Domestic' },
  { id: 'international', label: '🌍 International' },
  { id: 'adventure', label: '🏔️ Adventure' },
];

export default function PackagesSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);

  const filtered = activeCategory === 'all'
    ? mockPackages
    : mockPackages.filter(p => p.category === activeCategory);

  if (selectedPackage) {
    return <PackageDetail pkg={selectedPackage} onBack={() => setSelectedPackage(null)} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-[Poppins]">Holiday Packages</h2>
          <p className="text-muted-foreground">Handpicked tours for every traveler</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(pkg => (
          <Card key={pkg.id} className="overflow-hidden hover:shadow-xl transition group cursor-pointer" onClick={() => setSelectedPackage(pkg)}>
            <div className="relative h-52 overflow-hidden">
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-lg font-bold">{pkg.destination}</p>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {pkg.duration}
                </p>
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                {pkg.category === 'adventure' && pkg.difficulty && (
                  <span className="bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded-full">
                    {pkg.difficulty}
                  </span>
                )}
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full capitalize">
                  {pkg.category}
                </span>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-foreground text-lg mb-2">{pkg.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{pkg.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {pkg.highlights.slice(0, 3).map((h, i) => (
                  <span key={i} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">{h}</span>
                ))}
              </div>

              <div className="flex justify-between items-end pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-semibold text-foreground text-sm">{pkg.rating}</span>
                  <span className="text-xs text-muted-foreground">({pkg.reviews})</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground line-through">₹{pkg.originalPrice.toLocaleString('en-IN')}</p>
                  <p className="text-xl font-bold text-primary">₹{pkg.price.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-muted-foreground">per person</p>
                </div>
              </div>

              <Button className="w-full mt-4" onClick={e => { e.stopPropagation(); setSelectedPackage(pkg); }}>
                Explore Package <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
