import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FlightsSection from '@/components/FlightsSection';
import HotelsSection from '@/components/HotelsSection';
import TrainsSection from '@/components/TrainsSection';
import PackagesSection from '@/components/PackagesSection';

const Index = () => {
  const [activeTab, setActiveTab] = useState('flights');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 py-10">
        {activeTab === 'flights' && <FlightsSection />}
        {activeTab === 'hotels' && <HotelsSection />}
        {activeTab === 'trains' && <TrainsSection />}
        {activeTab === 'packages' && <PackagesSection />}
      </main>
      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-10 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold font-[Poppins] mb-3">TravelHub</h3>
              <p className="text-sm text-secondary-foreground/70">Your one-stop destination for flights, hotels, trains, and holiday packages.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/70">
                <li className="cursor-pointer hover:text-secondary-foreground" onClick={() => setActiveTab('flights')}>Flights</li>
                <li className="cursor-pointer hover:text-secondary-foreground" onClick={() => setActiveTab('hotels')}>Hotels</li>
                <li className="cursor-pointer hover:text-secondary-foreground" onClick={() => setActiveTab('trains')}>Trains</li>
                <li className="cursor-pointer hover:text-secondary-foreground" onClick={() => setActiveTab('packages')}>Packages</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/70">
                <li>Help Center</li>
                <li>Terms & Conditions</li>
                <li>Privacy Policy</li>
                <li>Refund Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact Us</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/70">
                <li>📧 support@travelhub.com</li>
                <li>📞 +91 1800-XXX-XXXX</li>
                <li>🏢 Mumbai, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-foreground/10 mt-8 pt-6 text-center text-sm text-secondary-foreground/50">
            © {new Date().getFullYear()} TravelHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
