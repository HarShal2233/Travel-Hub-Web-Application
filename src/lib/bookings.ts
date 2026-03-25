import { supabase } from './supabase';
import type { Booking } from './types';

function generateRef(): string {
  return 'TH' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function generatePNR(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function saveBooking(
  type: Booking['type'],
  details: Record<string, any>,
  totalPrice: number
): Promise<{ booking: Booking | null; error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { booking: null, error: 'Please sign in to book' };

  const bookingRef = type === 'train' ? generatePNR() : generateRef();

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      type,
      booking_ref: bookingRef,
      details,
      total_price: totalPrice,
      status: 'confirmed',
    })
    .select()
    .single();

  if (error) {
    console.error('Booking save error:', error);
    return { booking: null, error: error.message };
  }

  return { booking: data as Booking, error: null };
}

export async function getBookings(): Promise<Booking[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch bookings error:', error);
    return [];
  }

  return (data || []) as Booking[];
}
