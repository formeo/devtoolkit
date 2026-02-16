export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for DevToolKit — free online developer tools.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-dark-50 mb-6">Privacy Policy</h1>
      <div className="text-sm text-dark-300 leading-relaxed space-y-4">
        <p><strong className="text-dark-100">Last updated:</strong> February 2026</p>
        
        <h2 className="text-lg font-semibold text-dark-100 pt-4">Data Collection</h2>
        <p>DevToolKit is committed to protecting your privacy. All our tools run entirely in your browser — <strong className="text-dark-100">no data is sent to our servers</strong>. Your code, tokens, text, and any other input you provide never leaves your device.</p>
        
        <h2 className="text-lg font-semibold text-dark-100 pt-4">Analytics</h2>
        <p>We use Google Analytics to understand how visitors use our site. Google Analytics collects anonymized usage data such as page views, session duration, and referral sources. This data helps us improve our tools and prioritize new features.</p>
        
        <h2 className="text-lg font-semibold text-dark-100 pt-4">Advertising</h2>
        <p>We display advertisements through Google AdSense to support the free operation of this website. Google may use cookies to serve ads based on your prior visits to this or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-brand-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>
        
        <h2 className="text-lg font-semibold text-dark-100 pt-4">Cookies</h2>
        <p>We use cookies for analytics and advertising purposes as described above. You can control cookie settings through your browser preferences.</p>
        
        <h2 className="text-lg font-semibold text-dark-100 pt-4">Third-Party Links</h2>
        <p>Our site may contain links to third-party websites. We are not responsible for the privacy practices of those sites.</p>
        
        <h2 className="text-lg font-semibold text-dark-100 pt-4">Changes</h2>
        <p>We may update this privacy policy from time to time. Changes will be posted on this page with an updated date.</p>
        
        <h2 className="text-lg font-semibold text-dark-100 pt-4">Contact</h2>
        <p>If you have questions about this privacy policy, please contact us through our GitHub repository.</p>
      </div>
    </div>
  );
}
