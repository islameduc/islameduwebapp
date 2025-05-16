import React from 'react'
import { footerLinks } from '../../../../assets/data/footerLinks'
import { Link } from 'react-router-dom'
import '../pageStyle.css'
import Footer from '../../../shared/footer/Footer'
import NavBar from '../../../shared/navbar/NavBar'

const TermsOfUse = () => {
  return (
    <div>
      <NavBar />
      <div className='pageStyle'>
        <div className="content">
        <h2 style={{ color: 'rgb(18, 95, 69)' }}>Terms of Use</h2>
          <br /><br />
          <h4>Introduction</h4>
          <p>A brief statement explaining that these terms govern the use of your website or application.</p>
          <br />
          <h4>Acceptance of Terms</h4>
          <p>Make it clear that by using your service, users agree to abide by these terms.</p>
          <br />
          <h4>Description of Service</h4>
          <p>Provide an overview of your service and its key features.</p>
          <br />
          <h4>User Accounts and Responsibilities</h4>
          <p>Explain user account requirements (if applicable).
            State that users are responsible for maintaining account security and all activity under their accounts.</p>
          <br />
          <h4>Intellectual Property Rights</h4>
          <p>Clarify that your service and its content are your property or properly licensed.
            Prohibit unauthorized use of your intellectual property.</p>
          <br />
          <h4>Acceptable Use Policy</h4>
          <p>Specify prohibited activities on your service (e.g., illegal activities, harassment, spam).</p>
          <br />
          <h4>Privacy Policy</h4>
          <p>Include a link to your separate privacy policy document.</p>
          <br />
          <h4>User-Generated Content</h4>
          <p>If users can contribute content, explain your rights to moderate, remove, or retain user-generated content.</p>
          <br />
          <h4>Third-Party Links and Content</h4>
          <p>Disclaim responsibility for third-party websites, content, or services linked from your site.</p>
          <br />
          <h4>Termination of Service</h4>
          <p>Reserve your right to terminate or suspend user access for violations of these terms.</p>
          <br />
          <h4>Limitation of Liability</h4>
          <p>Limit your liability to the maximum extent permitted by law.</p>
          <br />
          <h4>Indemnification</h4>
          <p>Require users to indemnify you against certain liabilities or costs.</p>
          <br />
          <h4>Governing Law and Jurisdiction</h4>
          <p>Specify which laws and jurisdiction will govern any disputes.</p>
          <br />
          <h4>Changes to Terms</h4>
          <p>Reserve your right to modify these terms and note how users will be notified of changes.</p>
          <br />
          <div >
            {footerLinks.resources.map((link) => (
              <Link style={{ fontSize: '20px', fontWeight: 'bold', color: 'blue' }} key={link.id} to={link.path}>
                {link.label}
              </Link>
            ))[2]}
            <p>If you have any questions or concerns about this Term Of Use, please contact us via the link above.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default TermsOfUse