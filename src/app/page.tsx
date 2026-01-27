'use client';

import { redirect } from 'next/navigation';

export default function Dashboard() {
  // Redirect to kanban as the main view
  redirect('/kanban');
}
