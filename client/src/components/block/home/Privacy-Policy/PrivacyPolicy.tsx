import React from 'react'
import { footerLinks } from '../../../../assets/data/footerLinks'
import { Link } from 'react-router-dom'
import '../pageStyle.css'
import Footer from '../../../shared/footer/Footer'
import NavBar from '../../../shared/navbar/NavBar'

const PrivacyPolicy = () => {
  return (
    <div>
      <NavBar />
      <div className='pageStyle'>
        <div className='content'>
          <h2 style={{ color: 'rgb(18, 95, 69)' }}>Privacy Policy</h2>
          <br /><br />
          <h4>Introduction</h4>
          <p>We at the IPES are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website at [website URL] or use our mobile application(s). Please read this Privacy Policy carefully.</p>
          <br />
          <h4>Information We Collect</h4>
          <p>We may collect personal information from you, such as your name, email address, mailing address, phone number, and payment information when you create an account, make a purchase, or contact us. We may also automatically collect non-personal information, such as your IP address, browser type, and usage data.</p>
          <br />
          <h4>How We Use Your Information</h4>
          <p>We may use your personal information to provide you with our products and services, process transactions, communicate with you about our offerings, and improve our website and applications. We may also use your information for marketing purposes, such as sending you promotional emails or targeted advertisements, unless you opt-out.</p>
          <br />
          <h4>Information Sharing and Disclosure</h4>
          <p>We do not sell or rent your personal information to third parties for their marketing purposes without your explicit consent. However, we may share your information with trusted third-party service providers who assist us in operating our website, applications, and business. We may also disclose your information if required by law or to protect our rights, property, or safety.</p>
          <br />
          <h4>Data Security</h4>
          <p>We implement reasonable security measures to protect your personal information from unauthorized access, use, alteration, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
          <br />
          <h4>Your Choices and Rights</h4>
          <p>You may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. You can also opt-out of marketing communications or withdraw your consent for certain processing activities.</p>
          <br />
          <h4>Children&apos;s Privacy</h4>
          <p>Our website and applications are not intended for children under the age of 13. We do not knowingly collect personal information from children without parental consent.</p>
          <br />
          <h4>Links to Third-Party Websites</h4>
          <p>Our website or applications may contain links to third-party websites or services that are not governed by this Privacy Policy. We are not responsible for the privacy practices of these third parties.</p>
          <br />
          <h4>Changes to This Privacy Policy</h4>
          <p>We may update this Privacy Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons.</p>
          <br />
          <div >
            {footerLinks.resources.map((link) => (
              <Link style={{ fontSize: '20px', fontWeight: 'bold' }}  key={link.id} to={link.path}>
                {link.label}
              </Link>
            ))[2]}
            <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us via the link above.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PrivacyPolicy