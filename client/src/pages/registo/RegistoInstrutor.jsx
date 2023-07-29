import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { HiUser, HiOutlineMail, HiOutlineKey, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineBadgeCheck, HiOutlinePhotograph } from 'react-icons/hi';
import Layout from '../../layout/Layout';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BsGenderMale } from 'react-icons/bs';
import { AiOutlinePhone } from 'react-icons/ai';
import { Loading } from '../../components';

const RegistoInstrutor = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [fotoPreview, setFotoPreview] = useState(null);
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(true);

  const onSubmit = async (dados) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/instrutores', {
        ...dados,
        foto: foto[0]
      },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      const { data } = response;
      toast.success(data.message);
      localStorage.setItem('token', data.token);
      localStorage.setItem('tipo', 'instrutores');
      setLoading(false);
      navigate('/');
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const senha = watch("senha", "");

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return <Loading legenda={"Envio de dados em progresso..."} />
  }

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-mono mt-32">
        <form onSubmit={handleSubmit(onSubmit)} className="border-2 border-yellow-400 shadow-md rounded px-8 pt-6 pb-8 mb-4" encType='multipart/form-data'>
          <h2 className="text-2xl mb-4">Registro Instrutor</h2>

          <div className="mb-4">
            <label className="block mb-2">
              <HiOutlinePhotograph className="inline-block mr-1" />Foto de Perfil
            </label>
            <input
              type="file"
              id="foto"
              {...register('foto', { required: true })}
              className="hidden"
              onChange={(e) => {
                // Atualize o estado quando o usuário selecionar uma nova imagem
                setFotoPreview(URL.createObjectURL(e.target.files[0]));
                setFoto(e.target.files);
              }}
            />
            <label
              htmlFor="foto"
              className="border-2 border-dashed border-red-400 rounded p-2 cursor-pointer hover:border-red-500"
            >
              <AiOutlineCloudUpload className="inline-block mr-1" />
              <span>Escolha uma imagem</span>
            </label>

            {
              // Adicione esta linha para renderizar a imagem de visualização
              fotoPreview && <img src={fotoPreview} alt="Foto de Perfil" className="w-24 h-24 object-cover rounded-md items-start mt-4" />
            }

            {
              errors.foto && <p className="text-red-400">Campo obrigatório</p>
            }
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              <HiUser className="inline-block mr-1" />Nome Completo
            </label>
            <input type="text" {...register('nome', { required: true })} className="w-full p-2 border-2 bg-transparent rounded outline-none border-yellow-400" placeholder='Nome Completo' />
            {
              errors.nome && <p className="text-red-400">Campo obrigatório</p>
            }
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              <BsGenderMale className="inline-block mr-1" />Endereço
            </label>
            <input type="text" {...register('endereco', { required: true })} className="w-full p-2 border-2 bg-transparent rounded outline-none border-yellow-400" placeholder='Endereço' />
            {
              errors.endereco && <p className="text-red-400">Campo obrigatório</p>
            }
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              <HiOutlineLocationMarker className="inline-block mr-1" />Sexo
            </label>
            <select {...register('sexo', { required: true })} className="w-full p-2 border-2 rounded bg-transparent outline-none border-yellow-400">
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
            {
              errors.sexo && <p className="text-red-400">Campo obrigatório</p>
            }
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              <AiOutlinePhone className="inline-block mr-1" />Telefone
            </label>
            <input type="text" {...register('telefone', { required: true })} className="w-full p-2 border-2 rounded bg-transparent outline-none border-yellow-400" placeholder='Telefone' />
            {
              errors.telefone && <p className="text-red-400">Campo obrigatório</p>
            }
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              <HiOutlineMail className="inline-block mr-1" />Email
            </label>
            <input type="email" {...register('email', { required: true })} className="w-full p-2 border-2 rounded bg-transparent outline-none border-yellow-400" placeholder='Email' />
            {
              errors.email && <p className="text-red-400">Campo obrigatório</p>
            }
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              <HiOutlineKey className="inline-block mr-1" />Senha
            </label>
            <input type="password" {...register('senha', { required: true })} className="w-full p-2 border-2 rounded bg-transparent outline-none border-yellow-400" placeholder='Senha' />
            {
              errors.senha && <p className="text-red-400">Campo obrigatório</p>
            }
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              <HiOutlineKey className="inline-block mr-1" />Confirme sua Senha
            </label>
            <input type="password" {...register('confirmaSenha', {
              validate: value =>
                value === senha || "As senhas não são iguais"
            })} className="w-full p-2 border-2 rounded bg-transparent outline-none border-yellow-400" placeholder='Confirme sua senha' />
            {
              errors.confirmaSenha && <p className="text-red-400">{errors.confirmaSenha.message}</p>
            }
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              <HiOutlineCalendar className="inline-block mr-1" />Data de Nascimento
            </label>
            <input type="date" {...register('dataNascimento', { required: true })} className="w-full p-2 border-2 rounded bg-transparent outline-none border-yellow-400" placeholder='Data de Nascimento' />
            {
              errors.dataNascimento && <p className="text-red-400">Campo obrigatório</p>
            }
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              <HiOutlineBadgeCheck className="inline-block mr-1" />CPF
            </label>
            <input type="text" {...register('cpf', { required: true })} className="w-full p-2 border-2 rounded bg-transparent outline-none border-yellow-400" placeholder='CPF' />
            {
              errors.cpf && <p className="text-red-400">Campo obrigatório</p>
            }
          </div>

          <button type="submit" className="text-green-400 border-2 border-green-400 rounded p-2 hover:border-green-600">
            Registrar
          </button>

          <div className="mt-4">
            Já possui uma conta? {' '}
            <NavLink to="/login" className="text-red-400 hover:text-red-600">
              Faça login
            </NavLink>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default RegistoInstrutor