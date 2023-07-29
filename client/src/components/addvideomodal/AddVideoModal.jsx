import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import ReactModal from 'react-modal';
import { BiErrorCircle, BiX } from "react-icons/bi";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BiSave } from "react-icons/bi";
import { toast } from 'react-toastify';
import { Loading } from '../../components';

ReactModal.setAppElement('#root');

const AddVideoModal = ({ isOpen, onRequestClose, cursoId, idProfessor, getCurso }) => {
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
  const [previewVideo, setPreviewVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);

  const onSubmit = useCallback(async (data) => {
    setLoading(true);

    const token = localStorage.getItem('token');

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      axios.post('http://localhost:5000/api/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
        toast.success('Vídeo adicionado com sucesso!');
        getCurso();
        setLoading(false);
        reset();
        onRequestClose();
      }).catch(err => {
        console.log(err);
        toast.error('Erro ao adicionar vídeo!');
        setLoading(false);
      });
    } catch (err) {
      console.log(err);
      toast.error('Erro ao adicionar vídeo!');
      setLoading(false);
    }
  }, [onRequestClose, getCurso, reset]);

  const handleVideoUpload = e => {
    setValue('video', e.target.files[0]);
    setPreviewVideo(URL.createObjectURL(e.target.files[0]));
  }

  const handleThumbnailUpload = e => {
    setValue('thumbnail', e.target.files[0]);
    setPreviewThumbnail(URL.createObjectURL(e.target.files[0]));
  }

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: '1px solid #2d3748',
      borderRadius: '0.5rem',
      padding: '2rem',
      backgroundColor: '#06000E',
      width: '40rem',
      height: '35rem',
      overFlow: 'auto',
    },
  };

  if (loading) {
    return <Loading legenda={'Adicionando vídeo...'} />
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Adicionar vídeo"
    >
      <h2 className="text-2xl text-purple-400 mb-4 font-mono">Adicionar vídeo</h2>

      {previewThumbnail && (
        <img src={previewThumbnail} alt="Thumbnail Preview" className="w-full object-cover h-64 mb-4" />
      )}

      {previewVideo && (
        <video src={previewVideo} controls className="w-full h-64 mb-4">
          Seu navegador não suporta o elemento de vídeo.
        </video>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 font-mono"
      >
        <input type="hidden" value={cursoId} {...register('curso')} />
        <input type="hidden" value={idProfessor} {...register('instrutor')} />

        <div>
          <input
            id='thumbnail'
            type="file"
            onChange={handleThumbnailUpload}
            className='hidden'
          />
          {errors.thumbnail && <span className="text-red-500 flex items-center space-x-2"><BiErrorCircle />{errors.thumbnail.message}</span>}
          <label
            htmlFor="thumbnail"
            className="flex items-center space-x-2 border-dashed border-2 border-red-500 rounded-md px-4 py-2 hover:text-green-400 transition-all duration-300 cursor-pointer"
          >
            <AiOutlineCloudUpload className="text-2xl" />
            <span>
              Selecione a thumbnail
            </span>
          </label>
        </div>

        <div>
          <input
            id='video'
            type="file"
            onChange={handleVideoUpload}
            className='hidden'
          />
          {errors.video && <span className="text-red-500 flex items-center space-x-2"><BiErrorCircle />{errors.video.message}</span>}
          <label
            htmlFor="video"
            className="flex items-center space-x-2 border-dashed border-2 border-red-500 rounded-md px-4 py-2 hover:text-green-400 transition-all duration-300 cursor-pointer"
          >
            <AiOutlineCloudUpload className="text-2xl" />
            <span>
              Selecione o vídeo
            </span>
          </label>
        </div>

        <div>
          <input
            type="text"
            placeholder="Titulo"
            {...register('titulo', { required: "Titulo é obrigatorio" })}
            className='outline-none bg-transparent border-2 rounded-md p-2 w-full border-red-400 transition-all duration-300'
          />
          {errors.titulo && <span className="text-red-500 flex items-center space-x-2"><BiErrorCircle />{errors.titulo.message}</span>}
        </div>

        <div>
          <textarea
            cols="30"
            rows="10"
            placeholder="Descrição"
            {...register('descricao', { required: "Descrição é obrigatorio" })}
            className='outline-none bg-transparent border-2 rounded-md p-2 border-red-400 w-full transition-all duration-300 resize-none'
          >

          </textarea>
          {errors.descricao && <span className="flex items-center space-x-2"><BiErrorCircle />{errors.descricao.message}</span>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Duração"
            {...register('duracao', { required: "Duration is required" })}
            className='outline-none bg-transparent border-2 rounded-md p-2 border-red-400 w-full transition-all duration-300'
          />
          {errors.duracao && <span className="text-red-500 flex items-center space-x-2"><BiErrorCircle />{errors.duracao.message}</span>}
        </div>

        <button
          type="submit"
          className="border-2 border-green-400 rounded-md px-4 py-2 hover:text-green-600 transition-all duration-300 hover:border-green-600"
        >
          <BiSave className="text-2xl inline-block" /> Salvar vídeo
        </button>
      </form>
      <BiX
        onClick={onRequestClose}
        size={32}
        className="absolute top-4 right-4 text-red-500 cursor-pointer hover:text-red-600 transition-all duration-300"
      />
    </ReactModal>
  );
};

export default AddVideoModal;