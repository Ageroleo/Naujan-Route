'use client';

import { useState, useEffect } from 'react';
import EmergencyAssistanceModal from './EmergencyAssistanceModal';

export default function EmergencyQuickAccess() {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for global open requests from Header or anywhere else in the app
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-emergency-modal', handleOpen);
    return () => window.removeEventListener('open-emergency-modal', handleOpen);
  }, []);

  return <EmergencyAssistanceModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}
