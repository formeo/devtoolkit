'use client';
import { useEffect, useRef } from 'react';

// ============================================================
// SET THIS TO TRUE AND FILL IN YOUR IDS WHEN ADSENSE IS APPROVED
const ADSENSE_ENABLED = false;
const AD_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX'; // Your AdSense publisher ID
// ============================================================

export default function AdBanner({ slot = 'XXXXXXXXXX', format = 'auto', className = '' }) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (ADSENSE_ENABLED && adRef.current && !pushed.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  // Hidden when AdSense is not configured
  if (!ADSENSE_ENABLED) return null;

  return (
    <div className={`min-h-[90px] ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
