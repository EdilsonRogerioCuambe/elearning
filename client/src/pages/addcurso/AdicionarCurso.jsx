import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../../layout/Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { Loading } from '../../components';
import { useNavigate } from 'react-router-dom';

const AdicionarCurso = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [instrutor, setInstrutor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const getInstrutor = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/instrutores/perfil', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setInstrutor(res.data);
      } catch (err) {
        toast.error(err?.response?.data?.message);
      }
    };

    getInstrutor();
  }, []);

  const onSubmit = async data => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/cursos/', {
        ...data,
        thumbnail: thumbnail[0],
        instrutor: instrutor._id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success(res.data.message);
      setLoading(false);
      navigate('/cursos');
    } catch (err) {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    }
  };

  if (loading) {
    return <Loading legenda={'Adicionando curso...'} />
  }

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-mono mt-32">
        <form onSubmit={handleSubmit(onSubmit)} className="border-2 border-yellow-400 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl mb-4">Adicionar Curso</h2>

          <div className="mb-4">
            <label className="block mb-2">Nome</label>
            <input type="text" {...register('nome', { required: true })} className="w-full p-2 border-2 rounded bg-transparent outline-none border-yellow-400" placeholder='Nome' />
            {errors.nome && <p className="text-red-500 text-xs italic">Por favor, informe o nome do curso.</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Descrição</label>
            <textarea {...register('descricao', { required: true })} className="w-full p-2 border-2 rounded bg-transparent outline-none border-yellow-400" placeholder='Descrição' />
            {errors.descricao && <p className="text-red-500 text-xs italic">Por favor, informe a descrição do curso.</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              <HiOutlinePhotograph className="inline-block mr-1" />Thumbnail
            </label>
            <input
              type="file"
              id="thumbnail"
              {...register('thumbnail', { required: true })}
              className="hidden"
              onChange={(e) => {
                // Atualize o estado quando o usuário selecionar uma nova imagem
                setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
                setThumbnail(e.target.files);
              }}
            />
            <label
              htmlFor="thumbnail"
              className="border-2 border-dashed border-red-400 rounded p-2 cursor-pointer hover:border-red-500 w-full text-center"
            >
              <AiOutlineCloudUpload className="inline-block mr-1" />
              <span>Escolha uma imagem</span>
            </label>

            {
              // Adicione esta linha para renderizar a imagem de visualização
              thumbnailPreview && <img src={thumbnailPreview} alt="Foto de Perfil" className="w-24 h-24 object-cover rounded-md items-start mt-4" />
            }

            {
              errors.foto && <p className="text-red-400">Campo obrigatório</p>
            }
          </div>

          <div className="mb-4">
            <label className="block mb-2">Preço</label>
            <input type="number" {...register('preco', { required: true })} className="w-full p-2 border-2 rounded bg-transparent outline-none border-yellow-400" placeholder='Preço' />
            {errors.preco && <p className="text-red-500 text-xs italic">Por favor, informe o preço do curso.</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Categoria</label>
            <input type="text" {...register('categoria', { required: true })} className="w-full p-2 border-2 rounded bg-transparent outline-none border-yellow-400" placeholder='Categoria' />
            {errors.categoria && <p className="text-red-500 text-xs italic">Por favor, informe a categoria do curso.</p>}
          </div>

          <button type="submit" className="text-green-400 border-2 border-green-400 rounded p-2 hover:border-green-600">
            Adicionar Curso
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AdicionarCurso;