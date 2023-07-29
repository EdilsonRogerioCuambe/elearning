import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

const CommentsSection = ({ usuario, video, getVideo }) => {
  const [autorTipo, setAutor] = useState('');
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const tipo = localStorage.getItem('tipo');

    if (tipo === 'instrutores') {
      setAutor('Instrutor');
    } else {
      setAutor('Estudante');
    }
  }, []);

  const onSubmitComentario = useCallback(async (data) => {
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:5000/api/comentarios', {
        conteudo: data.comentario,
        autor: usuario._id,
        video: video._id,
        tipoAutor: autorTipo
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success('Comentario enviado com sucesso!');
      reset();
      getVideo();
    } catch (err) {
      toast.error('Erro ao enviar comentario!');
    }
  }, [autorTipo, usuario._id, video._id, getVideo, reset]);

  const onSubmitResposta = useCallback(async (data, id) => {
    const token = localStorage.getItem('token');

    if (data[`resposta_${id}`] && usuario.nome && autorTipo) {
      await axios.post(`http://localhost:5000/api/comentarios/${id}/responder`, {
        conteudo: data[`resposta_${id}`],
        autor: usuario._id,
        tipoAutor: autorTipo,
        video: video._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success('Resposta enviada com sucesso!');
      reset();
      getVideo();
    } else {
      toast.error('Preencha todos os campos!');
    }
  }, [autorTipo, usuario._id, video._id, usuario.nome, getVideo, reset]);

  const deletarComentario = useCallback(async (id) => {
    const token = localStorage.getItem('token');

    if (video._id) {
      await axios.delete(`http://localhost:5000/api/comentarios/${id}/video/${video._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
    getVideo();
    toast.success('Comentario deletado com sucesso!');
  }, [video._id, getVideo]);

  const getComentarios = useCallback(async () => {
    const token = localStorage.getItem('token');

    try {
      if (video._id) {
        const res = await axios.get(`http://localhost:5000/api/comentarios/video/${video._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  }, [video._id]);

  useEffect(() => {
    getComentarios();
  }, [getComentarios]);

  return (
    <>
      <section className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Comentarios ({video?.comentarios?.length})</h3>
        <div className="border-2 border-gray-500 rounded-md p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <img
                src={usuario?.foto}
                alt={usuario?.nome}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <form onSubmit={handleSubmit(onSubmitComentario)}>
                  <textarea
                    {...register('comentario')}
                    placeholder="Escreva um comentario..."
                    className="w-full h-20 bg-transparent border-2 border-gray-500 rounded-md p-2 outline-none"
                  >
                  </textarea>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="border-2 border-green-500 rounded-md px-4 py-2 text-green-500 font-mono hover:bg-green-500 hover:text-white transition-all duration-300">
                      Comentar
                    </button>
                  </div>
                </form>
              </div>

            </div>
            {video?.comentarios?.map((comentario, index) => (
              <div key={index} className="flex items-start gap-4">
                <img
                  src={comentario?.autor?.foto}
                  alt={comentario?.autor?.nome}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{comentario?.autor?.nome}</h3>
                      <span className="text-gray-500">
                        {comentario?.autor?.tipoUsuario}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button>
                        <AiOutlineEdit className="text-green-500 text-xl cursor-pointer" />
                      </button>
                      <button onClick={() => deletarComentario(comentario?._id)}>
                        <AiOutlineDelete className="text-red-500 text-xl cursor-pointer" />
                      </button>
                    </div>
                  </div>
                  <p className="text-lg">{comentario?.conteudo}</p>
                  <span className="text-gray-500">
                    {
                      new Date(comentario?.autor?.updatedAt).toLocaleDateString(
                        'pt-BR',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }
                      )
                    }
                  </span>
                  {comentario?.respostas?.map((resposta, idx) => (
                    <div key={idx} className="flex items-start gap-4 mt-4">
                      <img src={resposta?.imagem} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{resposta?.usuario}</h3>
                            <span className="text-gray-500">
                              {resposta?.tipoUsuario}
                            </span>
                          </div>
                        </div>
                        <p className="text-lg">{resposta?.comentario}</p>
                        <span className="text-gray-500">{resposta?.data?.toLocaleDateString(
                          'pt-BR',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }
                        )}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 mt-4">
                    <img
                      src={usuario?.foto}
                      alt={usuario?.nome}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">

                      <form onSubmit={handleSubmit((data) => onSubmitResposta(data, comentario?._id))}>
                        <textarea
                          {...register(`resposta_${comentario?._id}`)}
                          placeholder="Escreva uma resposta..."
                          className="w-full h-20 bg-transparent border-2 border-gray-500 rounded-md p-2 outline-none">
                        </textarea>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="border-2 border-green-500 rounded-md px-4 py-2 text-green-500 font-mono hover:bg-green-500 hover:text-white transition-all duration-300">
                            Responder
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default CommentsSection