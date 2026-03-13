import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet,
  Font
} from '@react-pdf/renderer';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #667eea',
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 12,
    borderLeft: '4px solid #667eea',
    paddingLeft: 10,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#f7fafc',
    padding: 8,
    borderRadius: 4,
  },
  itemCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemType: {
    fontSize: 10,
    color: '#718096',
    backgroundColor: '#edf2f7',
    padding: '4px 8px',
    borderRadius: 12,
    marginRight: 8,
    textTransform: 'uppercase',
  },
  itemTime: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#667eea',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 6,
  },
  itemDetail: {
    fontSize: 11,
    color: '#4a5568',
    marginBottom: 3,
  },
  flightRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ebf4ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  flightCity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5282',
  },
  flightTime: {
    fontSize: 11,
    color: '#4a5568',
    marginTop: 2,
  },
  confirmationBox: {
    backgroundColor: '#f7fafc',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  confirmationText: {
    fontSize: 10,
    color: '#4a5568',
  },
  confirmationNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a202c',
    marginTop: 2,
    fontFamily: 'Courier',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    color: '#718096',
    textAlign: 'center',
    borderTop: '1px solid #e2e8f0',
    paddingTop: 10,
  },
});

interface ItineraryItem {
  id: string;
  type: 'flight' | 'hotel' | 'car' | 'activity' | 'transport' | 'other';
  date: string;
  time?: string;
  title: string;
  details: Record<string, unknown>;
}

interface Trip {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  itinerary: ItineraryItem[];
  notes: Array<{ content: string; createdAt: string }>;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(timeStr?: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

function groupByDate(items: ItineraryItem[]): Record<string, ItineraryItem[]> {
  const groups: Record<string, ItineraryItem[]> = {};
  for (const item of items) {
    if (!groups[item.date]) {
      groups[item.date] = [];
    }
    groups[item.date].push(item);
  }
  for (const date of Object.keys(groups)) {
    groups[date].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }
  return groups;
}

// PDF Document Component using React.createElement (no JSX)
function createTripPDF(trip: Trip) {
  const groupedItinerary = groupByDate(trip.itinerary);
  const sortedDates = Object.keys(groupedItinerary).sort();

  const dateElements = sortedDates.map((date) => {
    const itemElements = groupedItinerary[date].map((item) => {
      const details = item.details || {};
      const itemChildren: React.ReactNode[] = [];

      // Item header
      const headerChildren: React.ReactNode[] = [
        React.createElement(Text, { style: styles.itemType, key: 'type' }, item.type),
      ];
      if (item.time) {
        headerChildren.push(
          React.createElement(Text, { style: styles.itemTime, key: 'time' }, formatTime(item.time))
        );
      }
      itemChildren.push(React.createElement(View, { style: styles.itemHeader, key: 'header' }, ...headerChildren));

      // Item title
      itemChildren.push(React.createElement(Text, { style: styles.itemTitle, key: 'title' }, item.title));

      // Flight-specific details
      if (item.type === 'flight') {
        if (details.airline) {
          itemChildren.push(
            React.createElement(Text, { style: styles.itemDetail, key: 'airline' }, 
              `${details.airline} ${details.flightNumber || ''}`
            )
          );
        }
        if (details.departure && details.arrival) {
          const depChildren: React.ReactNode[] = [
            React.createElement(Text, { style: styles.flightCity, key: 'city' }, details.departure as string),
          ];
          if (details.departureTime) {
            depChildren.push(React.createElement(Text, { style: styles.flightTime, key: 'time' }, formatTime(details.departureTime as string)));
          }
          if (details.departureTerminal) {
            depChildren.push(React.createElement(Text, { style: styles.flightTime, key: 'terminal' }, `Terminal ${details.departureTerminal}`));
          }

          const arrChildren: React.ReactNode[] = [
            React.createElement(Text, { style: styles.flightCity, key: 'city' }, details.arrival as string),
          ];
          if (details.arrivalTime) {
            arrChildren.push(React.createElement(Text, { style: styles.flightTime, key: 'time' }, formatTime(details.arrivalTime as string)));
          }
          if (details.arrivalTerminal) {
            arrChildren.push(React.createElement(Text, { style: styles.flightTime, key: 'terminal' }, `Terminal ${details.arrivalTerminal}`));
          }

          const routeChildren: React.ReactNode[] = [
            React.createElement(View, { key: 'dep' }, ...depChildren),
            React.createElement(Text, { style: { fontSize: 12, color: '#4a5568' }, key: 'arrow' }, '→'),
            React.createElement(View, { key: 'arr' }, ...arrChildren),
          ];
          itemChildren.push(React.createElement(View, { style: styles.flightRoute, key: 'route' }, ...routeChildren));
        }
      }

      // Hotel-specific details
      if (item.type === 'hotel') {
        if (details.address) {
          itemChildren.push(React.createElement(Text, { style: styles.itemDetail, key: 'addr' }, `📍 ${details.address}`));
        }
        if (details.phone) {
          itemChildren.push(React.createElement(Text, { style: styles.itemDetail, key: 'phone' }, `📞 ${details.phone}`));
        }
        if (details.email) {
          itemChildren.push(React.createElement(Text, { style: styles.itemDetail, key: 'email' }, `✉️ ${details.email}`));
        }
        if (details.checkIn || details.checkOut) {
          itemChildren.push(
            React.createElement(Text, { style: styles.itemDetail, key: 'checkin' },
              `Check-in: ${details.checkIn || 'N/A'} | Check-out: ${details.checkOut || 'N/A'}`
            )
          );
        }
      }

      // Activity-specific details
      if (item.type === 'activity') {
        if (details.location) {
          itemChildren.push(React.createElement(Text, { style: styles.itemDetail, key: 'loc' }, `📍 ${details.location}`));
        }
        if (details.notes) {
          itemChildren.push(React.createElement(Text, { style: styles.itemDetail, key: 'notes' }, details.notes as string));
        }
      }

      // Confirmation number
      if (details.confirmationNumber) {
        itemChildren.push(
          React.createElement(View, { style: styles.confirmationBox, key: 'conf' },
            React.createElement(Text, { style: styles.confirmationText }, 'Confirmation Number'),
            React.createElement(Text, { style: styles.confirmationNumber }, details.confirmationNumber as string)
          )
        );
      }

      return React.createElement(View, { key: item.id, style: styles.itemCard }, ...itemChildren);
    });

    return React.createElement(View, { key: date, style: styles.section },
      React.createElement(Text, { style: styles.dateHeader }, formatDate(date)),
      ...itemElements
    );
  });

  // Notes section
  const notesSection = trip.notes && trip.notes.length > 0
    ? React.createElement(View, { style: styles.section, key: 'notes' },
        React.createElement(Text, { style: styles.sectionTitle }, 'Notes'),
        ...trip.notes.map((note, index) =>
          React.createElement(View, { key: index, style: { ...styles.itemCard, marginBottom: 10 } },
            React.createElement(Text, { style: { fontSize: 11, color: '#2d3748' } }, note.content)
          )
        )
      )
    : null;

  const pageChildren: React.ReactNode[] = [
    // Header
    React.createElement(View, { style: styles.header, key: 'header' },
      React.createElement(Text, { style: styles.title }, trip.name),
      React.createElement(Text, { style: styles.subtitle }, `📍 ${trip.destination}`),
      React.createElement(Text, { style: styles.subtitle }, 
        `📅 ${formatDate(trip.start_date)} – ${formatDate(trip.end_date)}`
      )
    ),
    // Itinerary
    ...dateElements,
    // Notes
    ...(notesSection ? [notesSection] : []),
    // Footer
    React.createElement(Text, { style: styles.footer, key: 'footer' },
      `Generated by Bob Command Center • ${new Date().toLocaleDateString()}`
    ),
  ];

  return React.createElement(Document, {},
    React.createElement(Page, { size: 'A4', style: styles.page }, ...pageChildren)
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabase();
    
    // Fetch trip data
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Generate PDF
    const pdfStream = await renderToStream(
      createTripPDF(data as Trip)
    );

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${data.name.replace(/\s+/g, '-')}-itinerary.pdf"`,
      },
    });
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
