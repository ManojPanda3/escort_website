import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12">
      <div className="container mx-auto px-4">
        <div className="prose prose-invert mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
            Terms and Conditions
          </h1>
          
          <section className="mb-8">
            <h2>1. Overview</h2>
            <p>Welcome to All Nighter, a digital platform connecting users with independent adult service providers. Our platform, located at www.all-nighter.com, is operated by All Nighter ("we", "us", "our"). By using our platform, you agree to these terms and conditions.</p>
          </section>

          <section className="mb-8">
            <h2>2. Scope of Services</h2>
            <p>Our platform serves as a digital marketplace connecting those seeking adult services with independent providers. We act solely as an intermediary and do not provide any direct services. We aim to:</p>
            <ul>
              <li>Maintain a secure and private platform</li>
              <li>Ensure responsible and legal use of our services</li>
              <li>Facilitate connections between users and providers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>3. User Requirements</h2>
            <p>By using our platform, you confirm that:</p>
            <ul>
              <li>You are at least 18 years old</li>
              <li>You will provide accurate information</li>
              <li>You will use the platform legally and responsibly</li>
              <li>You accept our privacy policy and terms of service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>4. Provider Requirements</h2>
            <p>Service providers must:</p>
            <ul>
              <li>Be at least 18 years old</li>
              <li>Be independent (not associated with agencies)</li>
              <li>Provide accurate information and images</li>
              <li>Comply with local laws and regulations</li>
              <li>Maintain their own insurance and licenses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>5. Privacy and Security</h2>
            <p>We are committed to protecting your privacy and maintaining the security of our platform. We:</p>
            <ul>
              <li>Use industry-standard security measures</li>
              <li>Protect your personal information</li>
              <li>Never share your data without consent</li>
              <li>Comply with relevant privacy laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>6. Intellectual Property</h2>
            <p>All content on the platform, including but not limited to logos, designs, and text, is protected by copyright and other intellectual property rights owned by All Nighter or our licensors.</p>
          </section>

          <section className="mb-8">
            <h2>7. Disclaimer</h2>
            <p>All Nighter is a platform only and:</p>
            <ul>
              <li>Does not guarantee service quality</li>
              <li>Is not responsible for user interactions</li>
              <li>Makes no warranties about provider accuracy</li>
              <li>Is not liable for any damages or losses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>8. Contact</h2>
            <p>For any questions about these terms, please contact us at:</p>
            <p>Email: support@all-nighter.com</p>
          </section>

          <div className="text-center mt-12">
            <Link 
              href="/auth/signup" 
              className="inline-block bg-gradient-to-r from-amber-400 to-amber-600 text-black px-8 py-3 rounded-full font-semibold hover:from-amber-500 hover:to-amber-700 transition-all duration-300"
            >
              Accept & Continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

