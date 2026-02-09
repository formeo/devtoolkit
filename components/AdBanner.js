'use client';

export default function AdBanner({ slot = 'XXXXXXXXXX', format = 'auto', className = '' }) {
  // When AdSense is approved, uncomment the ins tag and remove the placeholder
  return (
    <div className={`rounded-lg border border-dashed border-dark-700 bg-dark-900 text-center text-dark-600 text-xs py-3 px-5 ${className}`}>
      📢 AD ZONE — Replace with AdSense code (slot: {slot})
      {/*
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <script dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }} />
      */}
    </div>
  );
}
