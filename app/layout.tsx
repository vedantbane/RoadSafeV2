import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RoadSafe | Community Road Safety Reporting',
  description: 'Report potholes, road hazards, and infrastructure issues to improve city safety.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
