import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiOutlineMail, HiOutlineKey } from 'react-icons/hi';
import Layout from '../../layout/Layout';
import { NavLink, useNavigate } from 'react-router-dom';
import { BiLogInCircle } from 'react-icons/bi';
import axios from 'axios';
import { Loading } from '../../components';
import { toast } from 'react-toastify';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const onSubmit = async data => {
    try {
      setLoading(true);

      // Fazendo login de acordo com o tipo selecionado
      const res = await axios.post(`http://localhost:5000/api/${data.tipo}/login`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      localStorage.setItem('tipo', data.tipo);
      localStorage.setItem('token', res.data.token);
      navigate('/');
      toast.success(res.data.message);
    } catch (err) {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    }
  };


  if (loading) {
    return <Loading legenda={'Entrando...'} />
  }

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-mono mt-32">
        <form onSubmit={handleSubmit(onSubmit)} className="border-2 border-yellow-400 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl mb-4">Login <BiLogInCircle className="inline-block" /></h2>

          <div className='mb-4'>
            <label className="block mb-2">
              Tipo
            </label>
            <select {...register('tipo', { required: true })} className="w-full p-2 border-2 rounded bg-transparent outline-none border-yellow-400 appearance-none">
              <option value="" className="bg-gray-900 text-white">Selecione o tipo</option>
              <option value="estudantes" className="bg-gray-900 text-white">Estudante</option>
              <option value="instrutores" className="bg-gray-900 text-white">Instrutor</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              <HiOutlineMail className="inline-block mr-1" />Email
            </label>
            <input type="email" {...register('email', { required: true })} className="w-full p-2 border-2 rounded bg-transparent outline-none border-yellow-400" placeholder='Email' />
            {errors.email && <p className="text-red-500 text-xs italic">Por favor, informe um e-mail válido.</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              <HiOutlineKey className="inline-block mr-1" />Senha
            </label>
            <input type="password" {...register('senha', { required: true })} className="w-full p-2 border-2 rounded bg-transparent outline-none border-yellow-400" placeholder='Senha' />
            {errors.senha && <p className="text-red-500 text-xs italic">Por favor, informe uma senha válida.</p>}
          </div>

          <button type="submit" className="text-green-400 border-2 border-green-400 rounded p-2 hover:border-green-600">
            Entrar
          </button>

          <p className="text-center text-gray-400 mt-4">
            Não tem uma conta? <NavLink to="/registo" className="text-green-400 hover:text-green-600">Registre-se</NavLink>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Login;