import React from 'react'
import Layout from '../../layout/Layout'
import { faker } from '@faker-js/faker'
import { NavLink } from 'react-router-dom'

const Sobre = () => {
  // Criação de uma lista de avaliações de estudantes falsos para demonstração
  const reviews = Array(10).fill().map(() => ({
    content: faker.lorem.paragraph(),
    name: faker.internet.userName(),
    img: faker.image.avatar(),
    stars: Math.round(Math.random() * 5)
  }))

  return (
    <Layout>
      <div className='container mx-auto px-4 font-mono mt-32'>
        <h1 className='text-4xl font-bold text-green-400 uppercase'>Sobre</h1>

        <section className='mt-10'>
          <h2 className='text-xl font-bold text-white'>
            Por que escolher a gente?
          </h2>
          <p className='my-4 text-white'>{faker.lorem.paragraph()}</p>
          <NavLink to='/cursos'
            className='border-2 border-green-500 rounded-md px-4 py-2 text-green-500 font-mono hover:bg-green-500 hover:text-white transition-all duration-300 mt-4'
          >
            Nossos Cursos
          </NavLink>
        </section>

        <section className='mt-10'>
          <h2 className='text-xl font-bold text-white'>
            Avaliações dos Estudantes
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
            {reviews.map((review, i) => (
              <div key={i} className='rounded-md p-4 border-2 border-red-400 bg-transparent'>
                <p className='text-green-400 text-lg mb-4'>
                  {review.content}
                </p>
                <div className='mt-4 flex items-center'>
                  <img className='h-10 w-10 rounded-full mr-4' src={review.img} alt={review.name} />
                  <div>
                    <h3 className='text-white text-lg font-bold'>
                      {review.name}
                    </h3>
                    <div className='flex mt-2'>
                      {[...Array(review.stars)].map((star, i) => (
                        <svg key={i} className='h-4 w-4 text-yellow-400' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                          <path d='M10 15.27L16.18 21l-1.64-7.03L22 9.24l-7.19-.61L10 2 7.19 8.63 0 9.24l5.46 4.73L3.82 21z' />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Sobre