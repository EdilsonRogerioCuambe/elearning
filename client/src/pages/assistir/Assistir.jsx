import React, { useState, useEffect, useCallback } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import { FaCalendar, FaHeart } from 'react-icons/fa'
import Layout from '../../layout/Layout';
import axios from 'axios';
import { Loading, CommentsSection, VideoPlaylist } from '../../components';
import { useForm } from 'react-hook-form';
import { FaFilePdf } from 'react-icons/fa';
import { BsLink45Deg } from 'react-icons/bs';
import { AiFillLike } from 'react-icons/ai';
import { animated, useSpring } from 'react-spring';
import { FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { FaDownload } from 'react-icons/fa';

const Assistir = () => {
  const { aula, curso } = useParams();
  const [video, setVideo] = useState({});
  const [tab, setTab] = useState('descricao'); // Nova variável de estado para controlar a aba ativa
  const [dadosCurso, setDadosCurso] = useState({}); // Nova variável de estado para armazenar os dados do curso
  const [usuario, setUsuario] = useState({}); // Nova variável de estado para armazenar os dados do usuário
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [curtidas, setCurtidas] = useState(video?.curtidas);
  const [newDocument, setNewDocument] = useState(''); // A new state variable to hold the new document name
  const [newLink, setNewLink] = useState(''); // A new state variable to hold the new link
  const [jaCurtido, setJaCurtido] = useState(false);


  const getVideo = useCallback(async () => {

    const token = localStorage.getItem('token');

    try {
      const res = await axios.get(`http://localhost:5000/api/videos/${aula}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setJaCurtido(res.data.usuariosCurtiram.includes(usuario._id));
      setVideo(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [aula, usuario._id]);

  const getCurso = useCallback(async () => {

    const token = localStorage.getItem('token');

    try {
      const res = await axios.get(`http://localhost:5000/api/cursos/${curso}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDadosCurso(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [curso]);

  const getUsuarioLogado = useCallback(async () => {
    try {
      const tipoUsuario = localStorage.getItem('tipo');
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.get(`http://localhost:5000/api/${tipoUsuario}/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsuario(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    getVideo();
  }, [getVideo]);

  useEffect(() => {
    getCurso();
  }, [getCurso]);

  useEffect(() => {
    getUsuarioLogado();
  }, [getUsuarioLogado]);

  useEffect(() => {
    if (video?._id) {
      setLoading(false);
    }
  }, [video]);

  const animacaoCurtir = useSpring({
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(1.2)' },
    config: { duration: 100 }
  });

  const curtirVideo = useCallback(async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/videos/${aula}/curtir`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // atualizamos o estado local com o retorno do backend
      setCurtidas(res.data.curtidas);
      setJaCurtido(res.data.jaCurtido);
      getVideo();
    } catch (err) {
      console.log(err);
    }
  }, [aula, getVideo]);

  const descurtirVideo = useCallback(async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/videos/${aula}/descurtir`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setCurtidas(res.data.curtidas);
      setJaCurtido(res.data.jaCurtido);
      getVideo();
    } catch (err) {
      console.log(err);
    }
  }, [aula, getVideo]);

  const addDocument = useCallback(async () => {
    const formData = new FormData();
    formData.append('documento', newDocument);

    console.log(newDocument);

    const token = localStorage.getItem('token');
    await axios.post(`http://localhost:5000/api/videos/${aula}/documentos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    setNewDocument(null); // Clear the file
    getVideo(); // Re-fetch the video to get the updated list of documents
  }, [aula, getVideo, newDocument]);

  useEffect(() => {
    if (newDocument) {
      addDocument();
    }
  }, [newDocument, addDocument]);

  const addLink = async () => {
    // Post the new link to the backend
    await axios.put(`http://localhost:5000/api/videos/${aula}/links`, {
      link: newLink,
    });
    setNewLink(''); // Clear the input field
    getVideo(); // Re-fetch the video to get the updated list of links
  };

  if (loading) {
    return <Loading legenda={'Carregando aula...'} />
  }

  return (
    <>
      <Layout>
        <div className="px-8 py-12 mt-20 font-mono">
          <section className="grid grid-cols-5 gap-8">
            <div className="col-span-3">
              <video
                src={video?.video}
                controls
                className="w-full h-96 rounded-md"></video>

              <h3 className="text-2xl font-semibold">{video?.titulo}</h3>
              <div className="flex items-center gap-4 my-4">
                <p className="flex items-center"><FaCalendar className="mr-1 text-red-500" />
                  <span>
                    {
                      new Date(video?.createdAt).toLocaleDateString(
                        'pt-BR',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }
                      )
                    }
                  </span>
                </p>
                <p className="flex items-center">
                  <animated.button
                    style={animacaoCurtir}
                    onClick={jaCurtido ? descurtirVideo : curtirVideo}
                    className="flex items-center gap-1 cursor-pointer mx-6">
                    {jaCurtido ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-red-500" />}
                    <span className="text-red-500">{jaCurtido ? 'descurtir' : 'curtir'}</span>
                  </animated.button>
                  <span className="mx-6 text-lg text-green-400">
                    <AiFillLike className="text-green-400 inline-block mr-2" />
                    {video?.curtidas}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={dadosCurso?.instrutor?.foto}
                  alt={dadosCurso?.instrutor?.nome}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-2">
                  <h3 className="font-semibold">
                    {dadosCurso?.instrutor?.nome}
                  </h3>
                  <span className="text-gray-500">
                    {dadosCurso?.instrutor?.tipoUsuario}
                  </span>
                </div>
              </div>

              {/* Tabs para Descrição e Documentos */}
              <div className="mt-4">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex" aria-label="Tabs">
                    <button
                      className={`cursor-pointer ${tab === 'descricao'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                      onClick={() => setTab('descricao')}
                    >
                      Descrição
                    </button>
                    <button
                      className={`ml-8 cursor-pointer ${tab === 'documentos'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                      onClick={() => setTab('documentos')}
                    >
                      Documentos
                    </button>
                  </nav>
                </div>
                <div className="mt-4">
                  {tab === 'descricao' ? (
                    <p className="text-lg">{video?.descricao}</p>
                  ) : tab === 'documentos' ? (
                    <>
                      <div>
                        <input
                          type="file"
                          className='hidden'
                          id='documento'
                          onChange={(e) => setNewDocument(e.target.files[0])}
                        />
                        <label htmlFor="documento">
                          <div className="flex items-center gap-2 cursor-pointer">
                            <FaFilePdf className="text-red-500" />
                            <span>Adicionar documento</span>
                          </div>
                        </label>
                      </div>
                      <ul>
                        {video?.documentos.map((documento, index) => {
                          const splitUrl = documento.split('/');
                          const fileName = splitUrl[splitUrl.length - 1];
                          return (
                            <li key={index} className="flex items-center gap-2">
                              <FaFilePdf className="text-red-500" />
                              <a href={documento} target="_blank" rel="noreferrer">{fileName}</a>
                              <a href={documento} download>
                                <FaDownload />
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    </>
                  ) : (
                    <>
                      <input type="text" value={newLink} onChange={e => setNewLink(e.target.value)} placeholder="Add a new link..." />
                      <button onClick={addLink}>Add Link</button>
                      <ul>
                        {video?.links.map((link, index) => (
                          <li key={index}><Link to={link}>{link}</Link></li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>

              {/* Início da seção de comentários */}
              <CommentsSection
                usuario={usuario}
                video={video}
                getVideo={getVideo}
              />
            </div>

            {/* Playlist dos vídeos */}
            <VideoPlaylist dadosCurso={dadosCurso} />

          </section>
        </div>
      </Layout>
    </>
  )
}

export default Assistir