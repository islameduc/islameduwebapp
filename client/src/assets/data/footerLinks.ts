import { paths } from '../../routers/paths';



export const footerLinks = {
  resources: [
    { label: 'Privacy Policy', id: 0, path: paths.PrivacyPolicy },
    { label: 'Terms of Use', id: 1, path: paths.TermsOfUse },
    { label: 'Contact Us', id: 2, path: paths.CONTACT, },
  ],
  company: [
    { label: 'Projects', id: 0, path: paths.OurProjects },
    { label: 'Members', id: 1, path: paths.MembersSection },
  ],
  socials: [
    { label: 'About Us', id: 0, path: paths.AboutUs },
    { label: 'Blog', id: 1, path: paths.POSTS, },
    { label: 'Partnerships', id: 2, path: 'https://camsol.io/', target:'_blank', rel:'noreferrer'},
  ],
};
