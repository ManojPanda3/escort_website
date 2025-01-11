import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12">
      <div className="container mx-auto px-4">
        <div className="prose prose-invert mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <section className="mb-8">
            <h2>1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Account information (email, username)</li>
              <li>Profile information (age, location, photos)</li>
              <li>Verification documents</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>2. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Verify user identity and age</li>
              <li>Process transactions</li>
              <li>Send service updates and notifications</li>
              <li>Improve our platform and user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>3. Information Sharing</h2>
            <p>We do not sell or rent your personal information. We may share your information:</p>
            <ul>
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers under strict confidentiality</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>4. Data Security</h2>
            <p>We implement security measures including:</p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage and transmission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>6. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Remember your preferences</li>
              <li>Analyze site usage</li>
              <li>Enhance site functionality</li>
              <li>Provide personalized content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>7. Children's Privacy</h2>
            <p>Our services are strictly for users 18 years or older. We do not knowingly collect information from minors.</p>
          </section>

          <section className="mb-8">
            <h2>8. Changes to Privacy Policy</h2>
            <p>We may update this privacy policy periodically. We will notify you of any material changes via email or site notification.</p>
          </section>

          <section className="mb-8">
            <h2>9. Contact Information</h2>
            <p>For privacy-related inquiries, contact us at:</p>
            <p>Email: privacy@all-nighter.com</p>
            <p>Address: [Company Address]</p>
          </section>

          <div className="text-center mt-12">
            <Link 
              href="/" 
              className="inline-block bg-gradient-to-r from-amber-400 to-amber-600 text-black px-8 py-3 rounded-full font-semibold hover:from-amber-500 hover:to-amber-700 transition-all duration-300"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

