import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Menu, X, User, LogOut, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUser, signOut, type AuthUser } from '@/lib/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    getUser().then(u => { setUser(u); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md z-50 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Plane className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground font-[Poppins]">TravelHub</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {!loading && !user ? (
            <>
              <Link to="/signin"><Button variant="ghost">Sign In</Button></Link>
              <Link to="/signup"><Button>Sign Up</Button></Link>
            </>
          ) : !loading && user ? (
            <>
              <span className="text-sm text-muted-foreground mr-2">
                Hi, {user.fullName?.split(' ')[0] || user.email}
              </span>
              <Link to="/my-bookings">
                <Button variant="ghost" size="sm"><BookOpen className="w-4 h-4 mr-1" /> My Bookings</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-1" /> Sign Out
              </Button>
            </>
          ) : (
            <div className="w-24 h-8 bg-muted animate-pulse rounded" />
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-2">
          {!loading && !user ? (
            <>
              <Link to="/signin" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Sign In</Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </>
          ) : !loading && user ? (
            <>
              <p className="text-sm text-muted-foreground px-3">Hi, {user.fullName}</p>
              <Link to="/my-bookings" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start"><BookOpen className="w-4 h-4 mr-2" /> My Bookings</Button>
              </Link>
              <Button variant="outline" className="w-full justify-start" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </>
          ) : null}
        </div>
      )}
    </nav>
  );
}
