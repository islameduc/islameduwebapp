import React from 'react'
import ContactForm from '../../../components/block/home/contact-form/ContactForm'
import AdminLayout from '../../../layouts/Admin.layout'


const ContactPage = () => {
  return (
    <AdminLayout
      padding='50px 20px 0'
    >
      <ContactForm />
    </AdminLayout>
  )
}

export default ContactPage