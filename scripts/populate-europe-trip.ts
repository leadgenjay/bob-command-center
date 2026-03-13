import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const europeItinerary = [
  // Feb 16 - Departure from Miami
  {
    id: 'flight-mia-mad-feb16',
    type: 'flight',
    date: '2026-02-16',
    time: '21:45',
    title: 'Miami → Madrid',
    details: {
      airline: 'Air Europa',
      flightNumber: 'UX098',
      departure: 'MIA',
      arrival: 'MAD',
      departureTime: '21:45',
      arrivalTime: '12:05',
      confirmationNumber: '7SEI5P',
      duration: '8h 20m',
    },
  },
  // Feb 17 - Arrival in Milan
  {
    id: 'flight-mad-mxp-feb17',
    type: 'flight',
    date: '2026-02-17',
    time: '15:10',
    title: 'Madrid → Milan',
    details: {
      airline: 'Air Europa',
      flightNumber: 'UX1061',
      departure: 'MAD',
      arrival: 'MXP',
      departureTime: '15:10',
      arrivalTime: '17:20',
      confirmationNumber: '7SEI5P',
      duration: '2h 10m',
    },
  },
  {
    id: 'hotel-milan-suite-feb17',
    type: 'hotel',
    date: '2026-02-17',
    time: '19:00',
    title: 'Milan Suite Hotel',
    details: {
      address: 'Via Varesina 124, Milan 20156',
      confirmationNumber: 'ZO-AX1029-55149',
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
    },
  },
  {
    id: 'activity-olympics-feb17',
    type: 'activity',
    date: '2026-02-17',
    time: '20:00',
    title: 'Dinner in Milan',
    details: {
      notes: 'First evening in Milan',
    },
  },
  // Feb 18 - Olympics Day 1 & Hotel Change
  {
    id: 'activity-olympics-feb18-morning',
    type: 'activity',
    date: '2026-02-18',
    time: '08:00',
    title: 'Breakfast',
    details: {},
  },
  {
    id: 'activity-olympics-feb18',
    type: 'activity',
    date: '2026-02-18',
    time: '11:00',
    title: 'Winter Olympics - Day 1',
    details: {
      notes: 'First day at the Winter Olympics!',
    },
  },
  {
    id: 'hotel-plein-feb18',
    type: 'hotel',
    date: '2026-02-18',
    time: '15:00',
    title: 'The Plein Hotel',
    details: {
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
      notes: "Friend's spare room booking",
    },
  },
  {
    id: 'activity-olympics-feb18-dinner',
    type: 'activity',
    date: '2026-02-18',
    time: '18:00',
    title: 'Dinner',
    details: {},
  },
  // Feb 19 - Olympics Day 2
  {
    id: 'activity-olympics-feb19-breakfast',
    type: 'activity',
    date: '2026-02-19',
    time: '08:00',
    title: 'Breakfast',
    details: {},
  },
  {
    id: 'activity-olympics-feb19',
    type: 'activity',
    date: '2026-02-19',
    time: '11:00',
    title: 'Winter Olympics - Day 2',
    details: {
      notes: 'Second day at the Winter Olympics!',
    },
  },
  {
    id: 'activity-olympics-feb19-dinner',
    type: 'activity',
    date: '2026-02-19',
    time: '18:00',
    title: 'Dinner',
    details: {},
  },
  // Feb 20 - Milan to Munich
  {
    id: 'activity-feb20-breakfast',
    type: 'activity',
    date: '2026-02-20',
    time: '07:30',
    title: 'Breakfast',
    details: {},
  },
  {
    id: 'activity-feb20-explore',
    type: 'activity',
    date: '2026-02-20',
    time: '12:00',
    title: 'Explore Milan & Pack Up',
    details: {
      notes: 'Last few hours in Milan before heading to airport',
    },
  },
  {
    id: 'flight-mxp-muc-feb20',
    type: 'flight',
    date: '2026-02-20',
    time: '16:00',
    title: 'Milan → Munich',
    details: {
      airline: 'EasyJet',
      flightNumber: 'EJU3945',
      departure: 'MXP',
      arrival: 'MUC',
      departureTime: '16:00',
      departureTerminal: '2',
      arrivalTime: '17:10',
      arrivalTerminal: '1',
      confirmationNumber: 'EJU3945',
      duration: '1h 10m',
      notes: 'Bag drop opens 13:00, closes 15:20',
    },
  },
  {
    id: 'hotel-sofitel-munich-feb20',
    type: 'hotel',
    date: '2026-02-20',
    time: '18:00',
    title: 'Sofitel Munich Bayerpost',
    details: {
      address: 'Bayerstrasse 12, 80335 Munich',
      phone: '+49-89-599480',
      email: 'h5413@sofitel.com',
      confirmationNumber: 'QCLDJTLH',
      checkIn: '3:00 PM',
      checkOut: '12:00 PM',
    },
  },
  // Feb 21 - Munich Adventure
  {
    id: 'activity-feb21-dachau',
    type: 'activity',
    date: '2026-02-21',
    time: '10:00',
    title: 'Dachau Concentration Camp Tour',
    details: {
      notes: 'Historical tour',
    },
  },
  {
    id: 'activity-feb21-dinner',
    type: 'activity',
    date: '2026-02-21',
    time: '19:00',
    title: 'Lederhosen Biergarten Dinner',
    details: {
      notes: 'Traditional Bavarian experience',
    },
  },
  // Feb 22 - Munich to Austria
  {
    id: 'transport-feb22-charter',
    type: 'transport',
    date: '2026-02-22',
    time: '12:00',
    title: 'Private Charter Bus to Austria',
    details: {
      notes: 'Stop at Neuschwanstein Castle along the way',
    },
  },
  {
    id: 'activity-feb22-neuschwanstein',
    type: 'activity',
    date: '2026-02-22',
    time: '14:00',
    title: 'Neuschwanstein Castle Visit',
    details: {
      location: 'Neuschwanstein Castle, Bavaria',
      notes: 'Photo stop on the way to Austria',
    },
  },
  {
    id: 'hotel-aqua-dome-feb22',
    type: 'hotel',
    date: '2026-02-22',
    time: '16:00',
    title: 'Aqua Dome Resort & Spa, Sölden',
    details: {
      notes: 'Group reservation via MOJO. Meals included: Breakfast + Dinner daily. Shuttle to town every 10-20 min.',
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
    },
  },
  {
    id: 'activity-feb22-welcome-dinner',
    type: 'activity',
    date: '2026-02-22',
    time: '19:00',
    title: 'Welcome Dinner',
    details: {
      location: 'Aqua Dome Resort',
    },
  },
  // Feb 23 - Mastermind Day 1
  {
    id: 'activity-feb23-ski',
    type: 'activity',
    date: '2026-02-23',
    time: '09:00',
    title: 'Ski Until 2 PM',
    details: {
      notes: 'Shuttle to slopes every 10 min',
    },
  },
  {
    id: 'activity-feb23-mastermind',
    type: 'activity',
    date: '2026-02-23',
    time: '16:00',
    title: 'Mastermind + Think Tanks',
    details: {
      notes: 'Session 1',
    },
  },
  {
    id: 'activity-feb23-dinner',
    type: 'activity',
    date: '2026-02-23',
    time: '19:30',
    title: 'Dinner at Hotel',
    details: {
      notes: 'Included with stay',
    },
  },
  // Feb 24 - Mastermind Day 2
  {
    id: 'activity-feb24-ski',
    type: 'activity',
    date: '2026-02-24',
    time: '09:00',
    title: 'Ski Until 2 PM',
    details: {},
  },
  {
    id: 'activity-feb24-mastermind',
    type: 'activity',
    date: '2026-02-24',
    time: '16:00',
    title: 'Mastermind + Think Tanks',
    details: {
      notes: 'Session 2',
    },
  },
  {
    id: 'activity-feb24-dinner',
    type: 'activity',
    date: '2026-02-24',
    time: '19:30',
    title: 'Dinner at Hotel',
    details: {
      notes: 'Included with stay',
    },
  },
  // Feb 25 - Mastermind Day 3 & James Bond
  {
    id: 'activity-feb25-ski',
    type: 'activity',
    date: '2026-02-25',
    time: '09:00',
    title: 'Ski / Non-Skier Shuttle',
    details: {},
  },
  {
    id: 'activity-feb25-ice-q',
    type: 'activity',
    date: '2026-02-25',
    time: '14:00',
    title: 'James Bond Venue Lunch @ Ice Q',
    details: {
      notes: 'Included in package',
      location: 'Ice Q Restaurant, Sölden',
    },
  },
  {
    id: 'activity-feb25-apres',
    type: 'activity',
    date: '2026-02-25',
    time: '16:00',
    title: 'Après Ski',
    details: {},
  },
  {
    id: 'activity-feb25-dinner',
    type: 'activity',
    date: '2026-02-25',
    time: '19:30',
    title: 'Dinner at Hotel',
    details: {
      notes: 'Optional: Fire & Ice nightlife in Sölden',
    },
  },
  // Feb 26 - James Bond / Ski / BMW
  {
    id: 'activity-feb26-ski-bmw',
    type: 'activity',
    date: '2026-02-26',
    time: '09:00',
    title: 'Ski or BMW Winter Racing Experience',
    details: {
      notes: 'Optional BMW Winter Racing: $1,200-1,400/person, 1hr from hotel each way. Needs 14 people to confirm.',
    },
  },
  // Feb 27 - Departure to Munich Airport
  {
    id: 'transport-feb27-shuttle',
    type: 'transport',
    date: '2026-02-27',
    time: '12:00',
    title: 'Shuttle to Munich Airport',
    details: {
      notes: 'Timing TBD',
    },
  },
  {
    id: 'hotel-hilton-munich-airport-feb27',
    type: 'hotel',
    date: '2026-02-27',
    time: '16:00',
    title: 'Hilton Munich Airport',
    details: {
      address: 'Terminalstrasse Mitte 20, Oberding DE 85356',
      confirmationNumber: '9079765902218',
      notes: 'Amex Trip Ref: ZO-AX1030-72407',
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
    },
  },
  // Feb 28 - Return to Miami
  {
    id: 'flight-muc-lis-feb28',
    type: 'flight',
    date: '2026-02-28',
    time: '06:05',
    title: 'Munich → Lisbon',
    details: {
      airline: 'TAP',
      departure: 'MUC',
      arrival: 'LIS',
      departureTime: '06:05',
      departureTerminal: '2',
      arrivalTime: '08:30',
      arrivalTerminal: '1',
      confirmationNumber: 'Y5VR5X',
      duration: '3h 25m',
    },
  },
  {
    id: 'flight-lis-mia-feb28',
    type: 'flight',
    date: '2026-02-28',
    time: '10:15',
    title: 'Lisbon → Miami',
    details: {
      airline: 'TAP',
      departure: 'LIS',
      arrival: 'MIA',
      departureTime: '10:15',
      arrivalTime: '14:50',
      confirmationNumber: 'Y5VR5X',
      duration: '9h 35m',
      notes: '1h 45m layover in Lisbon',
    },
  },
];

async function populateEuropeTrip() {
  try {
    console.log('🔍 Looking for Europe trip...');
    
    // Find the Europe trip
    const { data: trips, error: searchError } = await supabase
      .from('trips')
      .select('*')
      .ilike('name', '%europe%')
      .order('created_at', { ascending: false });

    if (searchError) {
      console.error('Error searching for trip:', searchError);
      return;
    }

    let tripId: string;

    if (!trips || trips.length === 0) {
      console.log('📝 Creating new Europe trip...');
      
      // Create new trip
      const { data: newTrip, error: createError } = await supabase
        .from('trips')
        .insert({
          id: `trip-europe-${Date.now()}`,
          name: 'Europe / Austria Ski & Mastermind Trip',
          destination: 'Milan, Munich, Austria',
          status: 'upcoming',
          start_date: '2026-02-16',
          end_date: '2026-02-28',
          timezone: 'Europe/Vienna',
          notes: [
            {
              id: `note-${Date.now()}-1`,
              content: 'European-style rooms (smaller, twin beds pushed together)',
              createdAt: new Date().toISOString(),
            },
            {
              id: `note-${Date.now()}-2`,
              content: 'Mastermind expectations: Be present, casual dress, support others',
              createdAt: new Date().toISOString(),
            },
            {
              id: `note-${Date.now()}-3`,
              content: 'Dog watcher: Jesse',
              createdAt: new Date().toISOString(),
            },
          ],
          itinerary: europeItinerary,
          packing: [],
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating trip:', createError);
        return;
      }

      tripId = newTrip.id;
      console.log(`✅ Created new trip: ${tripId}`);
    } else {
      tripId = trips[0].id;
      console.log(`✅ Found existing trip: ${tripId}`);
      
      // Update existing trip
      const { error: updateError } = await supabase
        .from('trips')
        .update({
          itinerary: europeItinerary,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tripId);

      if (updateError) {
        console.error('Error updating trip:', updateError);
        return;
      }

      console.log('✅ Updated trip with full itinerary');
    }

    console.log(`\n🎉 Success! Trip populated with ${europeItinerary.length} itinerary items`);
    console.log(`\nView trip at: http://localhost:3000/trips/${tripId}`);

  } catch (error) {
    console.error('Failed to populate Europe trip:', error);
  }
}

populateEuropeTrip();
