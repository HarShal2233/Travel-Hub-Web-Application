const API_KEY = import.meta.env.VITE_AMADEUS_API_KEY;
const API_SECRET = import.meta.env.VITE_AMADEUS_API_SECRET;
const BASE_URL = 'https://test.api.amadeus.com';

let accessToken: string | null = null;
let tokenExpiry = 0;

async function getToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;

  const res = await fetch(`${BASE_URL}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${API_SECRET}`,
  });

  const data = await res.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000 - 60000;
  return accessToken!;
}

export async function searchFlights(origin: string, destination: string, date: string) {
  const token = await getToken();
  const res = await fetch(
    `${BASE_URL}/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=1&currencyCode=INR&max=10`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.errors?.[0]?.detail || 'Failed to fetch flights');

  return (data.data || []).map((offer: any) => {
    const seg = offer.itineraries[0].segments[0];
    return {
      airline: seg.carrierCode,
      flight_number: seg.number,
      departure_airport: seg.departure.iataCode,
      arrival_airport: seg.arrival.iataCode,
      departure_time: seg.departure.at,
      arrival_time: seg.arrival.at,
      duration: offer.itineraries[0].duration,
      price: offer.price.total,
    };
  });
}

export async function searchHotels(cityCode: string, checkIn: string, checkOut: string) {
  const token = await getToken();

  // Step 1: Get hotel list
  const listRes = await fetch(
    `${BASE_URL}/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const listData = await listRes.json();
  const hotels = listData.data?.slice(0, 5);
  if (!hotels?.length) return [];

  const ids = hotels.map((h: any) => h.hotelId).join(',');

  // Step 2: Get offers
  const offersRes = await fetch(
    `${BASE_URL}/v3/shopping/hotel-offers?hotelIds=${ids}&checkInDate=${checkIn}&checkOutDate=${checkOut}&adults=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const offersData = await offersRes.json();

  return (offersData.data || []).map((hotel: any) => ({
    hotelId: hotel.hotel.hotelId,
    name: hotel.hotel.name,
    city: hotel.hotel.cityCode,
    rating: hotel.hotel.rating || 'N/A',
    price: hotel.offers?.[0]?.price?.total || '0',
    checkIn,
    checkOut,
  }));
}
