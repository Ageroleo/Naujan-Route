import type { Metadata } from 'next';
import VisitorDirectorySection from '@/components/directory/VisitorDirectorySection';

export const metadata: Metadata = {
  title: 'Directory — Tourism Offices & Travel Agencies',
  description:
    'Directory of government tourism offices, municipal authorities, and accredited travel agencies in Naujan and Oriental Mindoro, Philippines.',
};

export default function DirectoryPage() {
  return (
    <div className="px-4 py-6 md:py-8 max-w-7xl mx-auto space-y-8">
      <VisitorDirectorySection />
    </div>
  );
}
