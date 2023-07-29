import React from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import Layout from '../../layout/Layout'

const ContactForm = () => (
  <form action="" method="post" className="p-4 text-center bg-transparent rounded-md shadow-md border-2 border-red-500 lg:w-1/2 md:w-3/4 sm:w-full">
    <h3 className="mb-4 text-lg font-bold">Entre em contato</h3>
    <input type="text" placeholder="digite o seu nome" name="name" required maxLength="50" className="w-full bg-transparent p-2 mb-4 outline-none rounded border-2 border-green-400" />
    <input type="email" placeholder="digite o seu email" name="email" required maxLength="50" className="w-full p-2 mb-4 bg-transparent outline-none rounded border-2 border-green-400" />
    <input type="number" placeholder="digite o seu numero" name="number" required maxLength="50" className="w-full p-2 mb-4 outline-none bg-transparent rounded border-2 border-green-400" />
    <textarea
      className="outline-none rounded w-full p-2 mb-4 bg-transparent border-2 border-green-400"
      placeholder="digite a sua mensagem"
      required
      maxLength="1000" cols="30" rows="10">
    </textarea>
    <input type="submit" value="enviar mensagem" className="inline-btn bg-blue-500 text-white px-4 py-2 rounded" name="submit" />
  </form>
)

const ContactInfo = ({ icon: Icon, title, links }) => (
  <div className="border-2 border-gray-400 rounded-md p-6 text-center">
    <Icon className="text-blue-500 text-2xl" />
    <h3 className="font-bold my-2">{title}</h3>
    {links.map(link => <NavLink key={link.href} className="block text-blue-500" href={link.href}>{link.text}</NavLink>)}
  </div>
)

const Contato = () => {
  const infos = [
    {
      icon: FaPhone,
      title: "phone number",
      links: [
        { href: "tel:1234567890", text: "123-456-7890" },
        { href: "tel:1112223333", text: "111-222-3333" },
      ],
    },
    {
      icon: FaEnvelope,
      title: "email address",
      links: [
        { href: "mailto:shaikhanas@gmail.com", text: "shaikhanas@gmail.com" },
        { href: "mailto:anasbhai@gmail.com", text: "anasbhai@gmail.com" },
      ],
    },
    {
      icon: FaMapMarkerAlt,
      title: "office address",
      links: [
        { href: "#", text: "flat no. 1, a-1 building, jogeshwari, mumbai, india - 400104" },
      ],
    },
  ]

  return (
    <Layout>
      <section className="font-mono mt-32 mx-auto px-4">
        <div className="flex flex-wrap gap-4 justify-center">
          <ContactForm />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {infos.map((info, index) => <ContactInfo key={index} {...info} />)}
        </div>
      </section>
    </Layout>
  )
}

export default Contato